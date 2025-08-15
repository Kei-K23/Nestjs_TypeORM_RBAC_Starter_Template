import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerIndustryDto } from './create-customer-industry.dto';

export class UpdateCustomerIndustryDto extends PartialType(
  CreateCustomerIndustryDto,
) {}
