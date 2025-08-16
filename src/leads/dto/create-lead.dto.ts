import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUrl,
  MaxLength,
  Min,
  IsPositive,
} from 'class-validator';
import {
  LeadStageType,
  CustomerType,
  LeadSourceType,
} from '../entities/lead.entity';
import { Type } from 'class-transformer';

export class CreateLeadDto {
  @IsString({ message: 'Customer full name must be a string' })
  @IsNotEmpty({ message: 'Customer full name is required' })
  @MaxLength(255, {
    message: 'Customer full name must not exceed 255 characters',
  })
  customerFullName: string;

  @IsOptional()
  @IsString({ message: 'Customer job title must be a string' })
  @MaxLength(255, {
    message: 'Customer job title must not exceed 255 characters',
  })
  customerJobTitle?: string;

  @IsString({ message: 'Company name must be a string' })
  @IsNotEmpty({ message: 'Company name is required' })
  @MaxLength(255, { message: 'Company name must not exceed 255 characters' })
  companyName: string;

  @IsNumber({}, { message: 'Industry ID must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'Industry ID must be at least 1' })
  industryId: number;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  @MaxLength(20, { message: 'Phone must not exceed 20 characters' })
  phone: string;

  @IsOptional()
  @IsNumber({}, { message: 'Deal value must be a number' })
  @Min(0, { message: 'Deal value must be positive' })
  dealValue?: number;

  @IsOptional()
  @IsEnum(LeadStageType, { message: 'Invalid lead stage value' })
  leadStage?: LeadStageType;

  @IsNumber()
  @IsPositive()
  categoryId: number;

  @IsEnum(CustomerType, { message: 'Invalid customer type value' })
  @IsNotEmpty({ message: 'Customer type is required' })
  customerType: CustomerType;

  @IsString({ message: 'Service description must be a string' })
  @IsNotEmpty({ message: 'Service description is required' })
  serviceDescription: string;

  @IsOptional()
  @IsEnum(LeadSourceType, { message: 'Invalid lead source value' })
  leadSource?: LeadSourceType;

  @IsNumber({}, { message: 'Assigned to must be a number' })
  @IsNotEmpty({ message: 'Assigned to is required' })
  assignedTo: number;

  @IsOptional()
  @IsString({ message: 'Note must be a string' })
  note?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Website link must be a valid URL' })
  websiteLink?: string;
}
