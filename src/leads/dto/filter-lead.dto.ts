import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
  LeadStageType,
  CustomerType,
  CategoryType,
  LeadSourceType,
} from '../entities/lead.entity';

export class FilterLeadDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @IsOptional()
  @IsEnum(LeadStageType, { message: 'Invalid lead stage value' })
  leadStage?: LeadStageType;

  @IsOptional()
  @IsEnum(CustomerType, { message: 'Invalid customer type value' })
  customerType?: CustomerType;

  @IsOptional()
  @IsEnum(CategoryType, { message: 'Invalid category value' })
  category?: CategoryType;

  @IsOptional()
  @IsEnum(LeadSourceType, { message: 'Invalid lead source value' })
  leadSource?: LeadSourceType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Assigned to must be a number' })
  assignedTo?: number;

  @IsOptional()
  @IsString({ message: 'Industry must be a string' })
  industry?: string;
}
