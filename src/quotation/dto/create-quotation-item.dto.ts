import {
  IsString,
  IsNumber,
  IsNotEmpty,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuotationItemDto {
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsNumber({}, { message: 'Unit price must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Unit price must be zero or greater' })
  unitPrice: number;

  @IsNumber({}, { message: 'Total amount must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Total amount must be zero or greater' })
  totalAmount: number;
}
