import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import {
  LeadStageType,
  CustomerType,
  LeadSourceType,
} from '../entities/lead.entity';
import { PaginationFilterDto } from 'src/common/dots/pagination-filter.dto';

export class FilterLeadDto extends PaginationFilterDto {
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
  @Type(() => Number)
  @IsNumber({}, { message: 'Category ID must be a number' })
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Industry ID must be a number' })
  industryId?: number;

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
