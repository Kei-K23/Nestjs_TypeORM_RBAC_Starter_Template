import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { Lead, LeadStageType } from '../entities/lead.entity';
import { LeadActivity } from '../entities/lead-activity.entity';
import { User, UserDepartmentType } from 'src/user/entities/user.entity';
import {
  CreateLeadDto,
  UpdateLeadDto,
  FilterLeadDto,
  CreateLeadActivityDto,
  UpdateLeadActivityDto,
  FilterLeadActivityDto,
  UpdateLeadKanbanDto,
} from '../dto';
import { LeadCategory } from '../entities/lead-category.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(LeadActivity)
    private leadActivityRepository: Repository<LeadActivity>,
    @InjectRepository(LeadCategory)
    private leadCategoryRepository: Repository<LeadCategory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Lead CRUD Operations
  async findAllLeads(
    filterDto: FilterLeadDto,
  ): Promise<{ leads: Lead[]; total: number; getAll?: boolean }> {
    const {
      page = 1,
      limit = 10,
      search,
      leadStage,
      customerType,
      categoryId,
      assignedTo,
      industry,
      leadSource,
      getAll,
    } = filterDto;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Lead> = {};
    const findOptions: FindManyOptions<Lead> = {
      order: { createdAt: 'DESC' },
      relations: ['assignedUser', 'category'],
    };

    // Only apply pagination if getAll is NOT true
    if (!getAll) {
      findOptions.skip = skip;
      findOptions.take = limit;
    }

    // Apply filters
    if (leadStage) whereConditions.leadStage = leadStage;
    if (customerType) whereConditions.customerType = customerType;
    if (categoryId) whereConditions.categoryId = categoryId;
    if (leadSource) whereConditions.leadSource = leadSource;
    if (assignedTo) whereConditions.assignedTo = assignedTo;
    if (industry) whereConditions.industry = Like(`%${industry}%`);

    // Apply search (search in customerFullName, company, email)
    if (search) {
      findOptions.where = [
        { ...whereConditions, customerFullName: Like(`%${search}%`) },
        { ...whereConditions, company: Like(`%${search}%`) },
        { ...whereConditions, email: Like(`%${search}%`) },
      ];
    } else {
      findOptions.where = whereConditions;
    }

    const [leads, total] = await this.leadRepository.findAndCount(findOptions);
    return { leads, total, getAll };
  }

  async findOneLead(id: number): Promise<Lead | null> {
    return this.leadRepository.findOne({
      where: { id },
      relations: ['assignedUser', 'activities', 'category', 'activities.user'],
    });
  }

  async createLead(createLeadDto: CreateLeadDto): Promise<Lead> {
    // Validate assigned user exists
    const assignedUser = await this.userRepository.findOne({
      where: { id: createLeadDto.assignedTo },
    });

    if (!assignedUser) {
      throw new NotFoundException(
        `User with ID ${createLeadDto.assignedTo} not found`,
      );
    }

    // Validate category exists
    const category = await this.leadCategoryRepository.findOne({
      where: { id: createLeadDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createLeadDto.categoryId} not found`,
      );
    }

    // Get the next position for the lead stage
    const maxPosition = await this.getMaxPositionInStage(
      createLeadDto.leadStage || LeadStageType.LEAD,
    );

    const lead = this.leadRepository.create({
      ...createLeadDto,
      position: maxPosition + 1,
    });

    return await this.leadRepository.save(lead);
  }

  async updateLead(id: number, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOneLead(id);
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    // Get the old lead stage
    const oldLeadStage = lead?.leadStage;

    if (updateLeadDto.assignedTo) {
      // Check if assigned user exists
      const assignedUser = await this.userRepository.findOne({
        where: { id: updateLeadDto.assignedTo },
      });

      if (!assignedUser) {
        throw new NotFoundException('Assigned user not found');
      }
    }

    if (updateLeadDto.categoryId) {
      // Check if category exists
      const category = await this.leadCategoryRepository.findOne({
        where: { id: updateLeadDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateLeadDto.categoryId} not found`,
        );
      }
    }

    Object.assign(lead, updateLeadDto);
    if (updateLeadDto.leadStage) {
      if (oldLeadStage !== updateLeadDto.leadStage) {
        // Update the lead stage duration
        // Calculate duration for old stage
        const oldStageDuration =
          new Date().getTime() - new Date(lead.latestChangedStageAt).getTime();

        lead.leadStage = updateLeadDto.leadStage;
        lead.latestChangedStageAt = new Date();

        // Add duration to old stage
        if (oldLeadStage === LeadStageType.LEAD) {
          lead.leadStageDurationInDays = Math.round(
            oldStageDuration / (1000 * 60 * 60 * 24),
          );
        } else if (oldLeadStage === LeadStageType.QUOTATION) {
          lead.quotationStageDurationInDays = Math.round(
            oldStageDuration / (1000 * 60 * 60 * 24),
          );
        } else if (oldLeadStage === LeadStageType.NEGOTIATION) {
          lead.negotiationStageDurationInDays = Math.round(
            oldStageDuration / (1000 * 60 * 60 * 24),
          );
        } else if (oldLeadStage === LeadStageType.CLOSE_WON) {
          lead.closeWonStageDurationInDays = Math.round(
            oldStageDuration / (1000 * 60 * 60 * 24),
          );
        }
      }
    }

    return this.leadRepository.save(lead);
  }

  async removeLead(id: number): Promise<void> {
    const lead = await this.findOneLead(id);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    await this.leadRepository.delete(id);
  }

  // Lead Activity CRUD Operations
  async findAllActivities(
    filterDto: FilterLeadActivityDto,
  ): Promise<{ activities: LeadActivity[]; total: number }> {
    const { page = 1, limit = 10, leadId, action, actionBy } = filterDto;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<LeadActivity> = {};
    const findOptions: FindManyOptions<LeadActivity> = {
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['lead', 'user'],
    };

    // Apply filters
    if (leadId) whereConditions.leadId = leadId;
    if (action) whereConditions.action = action;
    if (actionBy) whereConditions.actionBy = actionBy;

    findOptions.where = whereConditions;

    const [activities, total] =
      await this.leadActivityRepository.findAndCount(findOptions);
    return { activities, total };
  }

  async findOneActivity(id: number): Promise<LeadActivity | null> {
    return this.leadActivityRepository.findOne({
      where: { id },
    });
  }

  async createActivity(
    createActivityDto: CreateLeadActivityDto,
  ): Promise<LeadActivity> {
    // Check if lead exists
    const lead = await this.leadRepository.findOne({
      where: { id: createActivityDto.leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    // Check if user exists
    const user = await this.userRepository.findOne({
      where: {
        id: createActivityDto.actionBy,
        department: UserDepartmentType.SALES,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const activity = this.leadActivityRepository.create(createActivityDto);
    return this.leadActivityRepository.save(activity);
  }

  async updateActivity(
    id: number,
    updateActivityDto: UpdateLeadActivityDto,
  ): Promise<LeadActivity | null> {
    const activity = await this.findOneActivity(id);

    if (!activity) {
      return null;
    }

    if (updateActivityDto.leadId) {
      // Check if lead exists
      const lead = await this.leadRepository.findOne({
        where: { id: updateActivityDto.leadId },
      });

      if (!lead) {
        throw new NotFoundException('Lead not found');
      }
    }

    if (updateActivityDto.actionBy) {
      // Check if user exists
      const user = await this.userRepository.findOne({
        where: { id: updateActivityDto.actionBy },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    Object.assign(activity, updateActivityDto);
    return this.leadActivityRepository.save(activity);
  }

  async removeActivity(id: number): Promise<boolean> {
    const activity = await this.findOneActivity(id);

    if (!activity) {
      return false;
    }

    await this.leadActivityRepository.delete(id);
    return true;
  }

  async getLeadsByUser(userId: number): Promise<Lead[]> {
    return this.leadRepository.find({
      where: { assignedTo: userId },
      relations: ['assignedUser'],
      order: { createdAt: 'DESC' },
    });
  }

  // Kanban Operations
  async updateLeadKanban(
    id: number,
    updateKanbanDto: UpdateLeadKanbanDto,
  ): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['assignedUser'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    const oldStage = lead.leadStage;

    // If stage is changing, we need to handle position reordering
    if (
      updateKanbanDto.leadStage &&
      updateKanbanDto.leadStage !== lead.leadStage
    ) {
      // Update positions of leads in the old stage
      await this.reorderLeadsInStage(lead.leadStage, lead.position, 'remove');

      // Set position for new stage
      if (updateKanbanDto.position !== undefined) {
        await this.reorderLeadsInStage(
          updateKanbanDto.leadStage,
          updateKanbanDto.position,
          'add',
        );
        lead.position = updateKanbanDto.position;
      } else {
        // If no position specified, add to end of new stage
        const maxPosition = await this.getMaxPositionInStage(
          updateKanbanDto.leadStage,
        );
        lead.position = maxPosition + 1;
      }

      // Calculate duration for old stage
      const oldStageDuration =
        new Date().getTime() - new Date(lead.latestChangedStageAt).getTime();

      lead.leadStage = updateKanbanDto.leadStage;
      lead.latestChangedStageAt = new Date();

      // Add duration to old stage
      if (oldStage === LeadStageType.LEAD) {
        lead.leadStageDurationInDays = Math.round(
          oldStageDuration / (1000 * 60 * 60 * 24),
        );
      } else if (oldStage === LeadStageType.QUOTATION) {
        lead.quotationStageDurationInDays = Math.round(
          oldStageDuration / (1000 * 60 * 60 * 24),
        );
      } else if (oldStage === LeadStageType.NEGOTIATION) {
        lead.negotiationStageDurationInDays = Math.round(
          oldStageDuration / (1000 * 60 * 60 * 24),
        );
      } else if (oldStage === LeadStageType.CLOSE_WON) {
        lead.closeWonStageDurationInDays = Math.round(
          oldStageDuration / (1000 * 60 * 60 * 24),
        );
      }
    } else if (
      updateKanbanDto.position !== undefined &&
      updateKanbanDto.position !== lead.position
    ) {
      // Just reordering within the same stage
      await this.reorderLeadsWithinStage(
        lead.leadStage,
        lead.position,
        updateKanbanDto.position,
      );
      lead.position = updateKanbanDto.position;
    }

    return await this.leadRepository.save(lead);
  }

  async getLeadsByStage(): Promise<{ [key: string]: Lead[] }> {
    const leads = await this.leadRepository.find({
      relations: ['assignedUser'],
      order: { position: 'ASC' },
    });

    const leadsByStage: { [key: string]: Lead[] } = {};

    // Initialize all stages
    Object.values(LeadStageType).forEach((stage) => {
      leadsByStage[stage] = [];
    });

    // Group leads by stage
    leads.forEach((lead) => {
      leadsByStage[lead.leadStage].push(lead);
    });

    return leadsByStage;
  }

  private async reorderLeadsInStage(
    stage: LeadStageType,
    position: number,
    operation: 'add' | 'remove',
  ): Promise<void> {
    if (operation === 'remove') {
      // Move all leads after the removed position up by 1
      await this.leadRepository
        .createQueryBuilder()
        .update(Lead)
        .set({ position: () => 'position - 1' })
        .where('leadStage = :stage AND position > :position', {
          stage,
          position,
        })
        .execute();
    } else {
      // Move all leads at and after the new position down by 1
      await this.leadRepository
        .createQueryBuilder()
        .update(Lead)
        .set({ position: () => 'position + 1' })
        .where('leadStage = :stage AND position >= :position', {
          stage,
          position,
        })
        .execute();
    }
  }

  private async reorderLeadsWithinStage(
    stage: LeadStageType,
    oldPosition: number,
    newPosition: number,
  ): Promise<void> {
    if (oldPosition < newPosition) {
      // Moving down: shift leads between old and new position up
      await this.leadRepository
        .createQueryBuilder()
        .update(Lead)
        .set({ position: () => 'position - 1' })
        .where(
          'leadStage = :stage AND position > :oldPosition AND position <= :newPosition',
          {
            stage,
            oldPosition,
            newPosition,
          },
        )
        .execute();
    } else {
      // Moving up: shift leads between new and old position down
      await this.leadRepository
        .createQueryBuilder()
        .update(Lead)
        .set({ position: () => 'position + 1' })
        .where(
          'leadStage = :stage AND position >= :newPosition AND position < :oldPosition',
          {
            stage,
            newPosition,
            oldPosition,
          },
        )
        .execute();
    }
  }

  private async getMaxPositionInStage(stage: LeadStageType): Promise<number> {
    const result = await this.leadRepository
      .createQueryBuilder('lead')
      .select('MAX(lead.position)', 'maxPosition')
      .where('lead.leadStage = :stage', { stage })
      .getRawOne<{ maxPosition: number }>();

    return result?.maxPosition || 0;
  }
}
