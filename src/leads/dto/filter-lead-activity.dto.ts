import { IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityActionType } from '../entities/lead-activity.entity';

export class FilterLeadActivityDto {
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
  @Type(() => Number)
  @IsNumber({}, { message: 'Lead ID must be a number' })
  leadId?: number;

  @IsOptional()
  @IsEnum(ActivityActionType, { message: 'Invalid action type value' })
  action?: ActivityActionType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Action by must be a number' })
  actionBy?: number;
}
