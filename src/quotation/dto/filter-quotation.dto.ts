import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationFilterDto } from 'src/common/dots/pagination-filter.dto';

export class FilterQuotationDto extends PaginationFilterDto {
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Customer ID must be a number' })
  @Type(() => Number)
  customerId?: number;

  @IsOptional()
  @IsString({ message: 'Quotation format must be a string' })
  quotationFormat?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Valid from date must be a valid date string' })
  validFromDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Valid to date must be a valid date string' })
  validToDate?: string;
}
