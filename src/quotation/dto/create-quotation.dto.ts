import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  MaxLength,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuotationItemDto } from './create-quotation-item.dto';

export class CreateQuotationDto {
  @IsString({ message: 'Quotation number must be a string' })
  @IsNotEmpty({ message: 'Quotation number is required' })
  @MaxLength(255, {
    message: 'Quotation number must not exceed 255 characters',
  })
  quotationNumber: string;

  @IsDateString({}, { message: 'Valid until date must be a valid date string' })
  @IsNotEmpty({ message: 'Valid until date is required' })
  validUntilAt: string;

  @IsString({ message: 'Quotation format must be a string' })
  @IsNotEmpty({ message: 'Quotation format is required' })
  @MaxLength(255, {
    message: 'Quotation format must not exceed 255 characters',
  })
  quotationFormat: string;

  @IsOptional()
  @IsNumber({}, { message: 'Customer ID must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'Customer ID must be at least 1' })
  customerId?: number;

  @IsString({ message: 'Customer name must be a string' })
  @IsNotEmpty({ message: 'Customer name is required' })
  @MaxLength(255, { message: 'Customer name must not exceed 255 characters' })
  customerName: string;

  @IsString({ message: 'Customer company name must be a string' })
  @IsNotEmpty({ message: 'Customer company name is required' })
  @MaxLength(255, {
    message: 'Customer company name must not exceed 255 characters',
  })
  customerCompanyName: string;

  @IsEmail({}, { message: 'Please provide a valid customer email address' })
  @IsNotEmpty({ message: 'Customer email is required' })
  customerEmail: string;

  @IsString({ message: 'Customer phone must be a string' })
  @IsNotEmpty({ message: 'Customer phone is required' })
  @MaxLength(20, { message: 'Customer phone must not exceed 20 characters' })
  customerPhone: string;

  @IsString({ message: 'Customer address must be a string' })
  @IsNotEmpty({ message: 'Customer address is required' })
  @MaxLength(255, {
    message: 'Customer address must not exceed 255 characters',
  })
  customerAddress: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items: CreateQuotationItemDto[];
}
