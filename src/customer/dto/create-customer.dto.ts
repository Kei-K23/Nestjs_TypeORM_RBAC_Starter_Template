import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerStatus } from '../entities/customer.entity';

export class CreateCustomerDto {
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(255, { message: 'Full name must not exceed 255 characters' })
  fullName: string;

  @IsString({ message: 'Company name must be a string' })
  @IsNotEmpty({ message: 'Company name is required' })
  @MaxLength(255, { message: 'Company name must not exceed 255 characters' })
  companyName: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @MaxLength(20, { message: 'Phone must not exceed 20 characters' })
  phone?: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @MaxLength(255, { message: 'Address must not exceed 255 characters' })
  address?: string;

  @IsNumber({}, { message: 'Industry ID must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'Industry ID must be at least 1' })
  industryId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Total value must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Total value must be zero or greater' })
  totalValue?: number = 0;

  @IsOptional()
  @IsEnum(CustomerStatus, { message: 'Invalid customer status value' })
  status?: CustomerStatus = CustomerStatus.ACTIVE;

  @IsOptional()
  @IsString({ message: 'Website must be a string' })
  @MaxLength(255, { message: 'Website must not exceed 255 characters' })
  website?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Assigned to must be a number' })
  @Type(() => Number)
  assignedTo?: number;

  @IsOptional()
  @IsString({ message: 'Tags must be a string' })
  tags?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}
