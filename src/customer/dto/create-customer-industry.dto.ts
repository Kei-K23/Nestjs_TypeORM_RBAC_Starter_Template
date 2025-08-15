import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerIndustryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
