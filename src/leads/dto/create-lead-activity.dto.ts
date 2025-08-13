import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ActivityActionType } from '../entities/lead-activity.entity';

export class CreateLeadActivityDto {
  @IsNumber({}, { message: 'Lead ID must be a number' })
  @IsNotEmpty({ message: 'Lead ID is required' })
  leadId: number;

  @IsOptional()
  @IsEnum(ActivityActionType, { message: 'Invalid action type value' })
  action?: ActivityActionType;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsNumber({}, { message: 'Action by must be a number' })
  @IsNotEmpty({ message: 'Action by is required' })
  actionBy: number;
}
