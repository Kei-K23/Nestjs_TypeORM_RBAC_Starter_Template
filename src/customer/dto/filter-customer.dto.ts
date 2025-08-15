import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerStatus } from '../entities/customer.entity';
import { PaginationFilterDto } from 'src/common/dots/pagination-filter.dto';

export class FilterCustomerDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  industryId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  assignedTo?: number;
}
