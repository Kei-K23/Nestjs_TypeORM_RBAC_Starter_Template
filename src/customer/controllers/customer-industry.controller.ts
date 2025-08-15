import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerIndustryService } from '../services/customer-industry.service';
import { CreateCustomerIndustryDto } from '../dto/create-customer-industry.dto';
import { UpdateCustomerIndustryDto } from '../dto/update-customer-industry.dto';
import { FilterCustomerIndustryDto } from '../dto/filter-customer-industry.dto';
import { ResponseUtil } from '../../common/utils/response.util';

@Controller('api/customer-industries')
export class CustomerIndustryController {
  constructor(
    private readonly customerIndustryService: CustomerIndustryService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createCustomerIndustryDto: CreateCustomerIndustryDto) {
    const industry = await this.customerIndustryService.create(
      createCustomerIndustryDto,
    );
    return ResponseUtil.success(
      industry,
      'Customer Industry created successfully',
    );
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filterDto: FilterCustomerIndustryDto) {
    const result = await this.customerIndustryService.findAll(filterDto);

    if (filterDto.getAll) {
      return ResponseUtil.success(
        result.industries,
        'All customer industries retrieved successfully',
      );
    }

    return ResponseUtil.paginated(
      result.industries,
      result.total,
      filterDto.page || 1,
      filterDto.limit || 10,
      'Customer industries retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const industry = await this.customerIndustryService.findOne(id);
    return ResponseUtil.success(
      industry,
      'Customer Industry retrieved successfully',
    );
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerIndustryDto: UpdateCustomerIndustryDto,
  ) {
    const industry = await this.customerIndustryService.update(
      id,
      updateCustomerIndustryDto,
    );
    return ResponseUtil.success(
      industry,
      'Customer Industry updated successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.customerIndustryService.remove(id);
    return ResponseUtil.success(null, 'Customer Industry deleted successfully');
  }
}
