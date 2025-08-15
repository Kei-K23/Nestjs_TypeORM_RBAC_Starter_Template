import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { FilterCustomerDto } from '../dto/filter-customer.dto';
import { ResponseUtil } from '../../common/utils/response.util';

@Controller('api/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const customer = await this.customerService.create(createCustomerDto);
    return ResponseUtil.success(customer, 'Customer created successfully');
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filterDto: FilterCustomerDto) {
    const result = await this.customerService.findAll(filterDto);

    if (filterDto.getAll) {
      return ResponseUtil.success(
        result.customers,
        'All customers retrieved successfully',
      );
    }

    return ResponseUtil.paginated(
      result.customers,
      result.total,
      filterDto.page || 1,
      filterDto.limit || 10,
      'Customers retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.customerService.findOne(id);
    return ResponseUtil.success(customer, 'Customer retrieved successfully');
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.customerService.update(id, updateCustomerDto);
    return ResponseUtil.success(customer, 'Customer updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.customerService.remove(id);
    return ResponseUtil.success(null, 'Customer deleted successfully');
  }
}
