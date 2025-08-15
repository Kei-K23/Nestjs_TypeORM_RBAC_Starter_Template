import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadCategoryDto } from './create-lead-category.dto';

export class UpdateLeadCategoryDto extends PartialType(CreateLeadCategoryDto) {}
