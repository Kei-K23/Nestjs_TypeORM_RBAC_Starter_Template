import { IsOptional, IsString } from 'class-validator';
import { PaginationFilterDto } from 'src/common/dots/pagination-filter.dto';

export class FilterCustomerIndustryDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}
