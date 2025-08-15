import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { LeadCategoryService } from '../services/lead-category.service';
import { ResponseUtil, ApiResponse } from '../../common';
import { LeadCategory } from '../entities/lead-category.entity';
import { FilterLeadCategoryDto } from '../dto/filter-lead-category.dto';
import { CreateLeadCategoryDto } from '../dto/create-lead-category.dto';
import { UpdateLeadCategoryDto } from '../dto/update-lead-category.dto';

@Controller('api/lead-categories')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class LeadCategoryController {
  constructor(private readonly leadCategoryService: LeadCategoryService) {}

  @Get()
  async findAll(
    @Query() filterDto: FilterLeadCategoryDto,
  ): Promise<ApiResponse<LeadCategory[]>> {
    const { categories, total } =
      await this.leadCategoryService.findAll(filterDto);

    return ResponseUtil.paginated(
      categories,
      total,
      filterDto.page || 1,
      filterDto.limit || 10,
      'Lead categories retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<LeadCategory>> {
    const category = await this.leadCategoryService.findOne(+id);
    return ResponseUtil.success(
      category,
      'Lead category retrieved successfully',
    );
  }

  @Post()
  async create(
    @Body() createLeadCategoryDto: CreateLeadCategoryDto,
  ): Promise<ApiResponse<LeadCategory>> {
    const category = await this.leadCategoryService.create(
      createLeadCategoryDto,
    );
    return ResponseUtil.success(category, 'Lead category created successfully');
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLeadCategoryDto: UpdateLeadCategoryDto,
  ): Promise<ApiResponse<LeadCategory>> {
    const category = await this.leadCategoryService.update(
      +id,
      updateLeadCategoryDto,
    );
    return ResponseUtil.success(category, 'Lead category updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    await this.leadCategoryService.remove(+id);
    return ResponseUtil.success(null, 'Lead category deleted successfully');
  }
}
