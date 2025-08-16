import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { LeadCategory } from '../entities/lead-category.entity';
import { FilterLeadCategoryDto } from '../dto/filter-lead-category.dto';
import { CreateLeadCategoryDto } from '../dto/create-lead-category.dto';
import { UpdateLeadCategoryDto } from '../dto/update-lead-category.dto';

@Injectable()
export class LeadCategoryService {
  constructor(
    @InjectRepository(LeadCategory)
    private leadCategoryRepository: Repository<LeadCategory>,
  ) {}

  async findAll(
    filterDto: FilterLeadCategoryDto,
  ): Promise<{ categories: LeadCategory[]; total: number }> {
    const { page = 1, limit = 10, search, getAll } = filterDto;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<LeadCategory> = {};
    const findOptions: FindManyOptions<LeadCategory> = {
      order: { createdAt: 'DESC' },
    };

    if (!getAll) {
      findOptions.take = limit;
      findOptions.skip = skip;
    }

    // Apply search
    if (search) {
      findOptions.where = [
        { ...whereConditions, name: Like(`%${search}%`) },
        { ...whereConditions, description: Like(`%${search}%`) },
      ];
    } else {
      findOptions.where = whereConditions;
    }

    const [categories, total] =
      await this.leadCategoryRepository.findAndCount(findOptions);
    return { categories, total };
  }

  async findOne(id: number): Promise<LeadCategory> {
    const category = await this.leadCategoryRepository.findOne({
      where: { id },
      relations: ['leads'],
    });

    if (!category) {
      throw new NotFoundException(`Lead category with ID ${id} not found`);
    }

    return category;
  }

  async create(
    createLeadCategoryDto: CreateLeadCategoryDto,
  ): Promise<LeadCategory> {
    // Check if category name already exists
    const existingCategory = await this.leadCategoryRepository.findOne({
      where: { name: createLeadCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Lead category with name '${createLeadCategoryDto.name}' already exists`,
      );
    }

    const category = this.leadCategoryRepository.create(createLeadCategoryDto);
    return this.leadCategoryRepository.save(category);
  }

  async update(
    id: number,
    updateLeadCategoryDto: UpdateLeadCategoryDto,
  ): Promise<LeadCategory> {
    const category = await this.findOne(id);

    // Check if new name conflicts with existing category
    if (
      updateLeadCategoryDto.name &&
      updateLeadCategoryDto.name !== category.name
    ) {
      const category = await this.leadCategoryRepository.findOne({
        where: { name: updateLeadCategoryDto.name },
      });

      if (category) {
        throw new ConflictException(
          `Lead category with name '${updateLeadCategoryDto.name}' already exists`,
        );
      }
    }

    Object.assign(category, updateLeadCategoryDto);
    return this.leadCategoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    // Check if category has associated leads
    if (category.leads && category.leads.length > 0) {
      throw new ConflictException(
        `Cannot delete category '${category.name}' because it has ${category.leads.length} associated leads`,
      );
    }

    await this.leadCategoryRepository.remove(category);
  }
}
