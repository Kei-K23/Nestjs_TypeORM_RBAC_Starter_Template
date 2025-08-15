import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ValidationPipe,
  UsePipes,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { LeadsService } from '../services/leads.service';
import {
  CreateLeadDto,
  UpdateLeadDto,
  FilterLeadDto,
  CreateLeadActivityDto,
  UpdateLeadActivityDto,
  FilterLeadActivityDto,
  UpdateLeadKanbanDto,
} from '../dto';
import { ResponseUtil, ApiResponse } from '../../common';
import { Lead } from '../entities/lead.entity';
import { LeadActivity } from '../entities/lead-activity.entity';

@Controller('api/leads')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // Lead endpoints
  @Get()
  async findAllLeads(
    @Query() filterDto: FilterLeadDto,
  ): Promise<ApiResponse<Lead[]>> {
    const { leads, total } = await this.leadsService.findAllLeads(filterDto);

    if (filterDto.getAll) {
      return ResponseUtil.success(leads, 'Leads retrieved successfully');
    } else {
      return ResponseUtil.paginated(
        leads,
        total,
        filterDto.page || 1,
        filterDto.limit || 10,
        'Leads retrieved successfully',
      );
    }
  }

  @Get(':id')
  async findOneLead(@Param('id') id: string): Promise<ApiResponse<Lead>> {
    const lead = await this.leadsService.findOneLead(+id);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return ResponseUtil.success(lead, 'Lead retrieved successfully');
  }

  @Post()
  async createLead(
    @Body() createLeadDto: CreateLeadDto,
  ): Promise<ApiResponse<Lead>> {
    const lead = await this.leadsService.createLead(createLeadDto);
    return ResponseUtil.success(lead, 'Lead created successfully');
  }

  @Put(':id')
  async updateLead(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ): Promise<ApiResponse<Lead>> {
    const lead = await this.leadsService.updateLead(+id, updateLeadDto);

    return ResponseUtil.success(lead, 'Lead updated successfully');
  }

  @Delete(':id')
  async removeLead(@Param('id') id: string): Promise<ApiResponse<null>> {
    await this.leadsService.removeLead(+id);
    return ResponseUtil.success(null, 'Lead deleted successfully');
  }

  // Lead activity endpoints
  @Get('activities/all')
  async findAllActivities(
    @Query() filterDto: FilterLeadActivityDto,
  ): Promise<ApiResponse<LeadActivity[]>> {
    const { activities, total } =
      await this.leadsService.findAllActivities(filterDto);

    return ResponseUtil.paginated(
      activities,
      total,
      filterDto.page || 1,
      filterDto.limit || 10,
      'Lead activities retrieved successfully',
    );
  }

  @Post('activities')
  async createActivity(
    @Body() createActivityDto: CreateLeadActivityDto,
  ): Promise<ApiResponse<LeadActivity>> {
    const activity = await this.leadsService.createActivity(createActivityDto);
    return ResponseUtil.success(activity, 'Lead activity created successfully');
  }

  @Put('activities/:id')
  async updateActivity(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateLeadActivityDto,
  ): Promise<ApiResponse<LeadActivity>> {
    const activity = await this.leadsService.updateActivity(
      +id,
      updateActivityDto,
    );

    if (!activity) {
      throw new NotFoundException('Lead activity not found');
    }

    return ResponseUtil.success(activity, 'Lead activity updated successfully');
  }

  @Delete('activities/:id')
  async removeActivity(@Param('id') id: string): Promise<ApiResponse<null>> {
    const deleted = await this.leadsService.removeActivity(+id);

    if (!deleted) {
      throw new NotFoundException('Lead activity not found');
    }

    return ResponseUtil.success(null, 'Lead activity deleted successfully');
  }

  // Utility endpoints
  @Get('user/:userId')
  async getLeadsByUser(
    @Param('userId') userId: string,
  ): Promise<ApiResponse<Lead[]>> {
    const leads = await this.leadsService.getLeadsByUser(+userId);
    return ResponseUtil.success(leads, 'User leads retrieved successfully');
  }

  // Kanban endpoints
  @Put(':id/kanban')
  async updateLeadKanban(
    @Param('id') id: string,
    @Body() updateKanbanDto: UpdateLeadKanbanDto,
  ): Promise<ApiResponse<Lead>> {
    const lead = await this.leadsService.updateLeadKanban(+id, updateKanbanDto);
    return ResponseUtil.success(
      lead,
      'Lead kanban position updated successfully',
    );
  }

  @Get('kanban/board')
  async getKanbanBoard(): Promise<ApiResponse<{ [key: string]: Lead[] }>> {
    const leadsByStage = await this.leadsService.getLeadsByStage();
    return ResponseUtil.success(
      leadsByStage,
      'Kanban board data retrieved successfully',
    );
  }
}
