import { IsOptional, IsString } from 'class-validator';
import { PaginationFilterDto } from 'src/common/dots/pagination-filter.dto';

export class FilterLeadCategoryDto extends PaginationFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}
