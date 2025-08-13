import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { LeadStageType } from '../entities/lead.entity';

export class UpdateLeadKanbanDto {
  @IsEnum(LeadStageType)
  @IsOptional()
  leadStage?: LeadStageType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  position?: number;
}
