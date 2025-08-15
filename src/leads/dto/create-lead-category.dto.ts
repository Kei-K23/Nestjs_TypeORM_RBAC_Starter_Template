import { IsString, IsOptional } from 'class-validator';

export class CreateLeadCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
