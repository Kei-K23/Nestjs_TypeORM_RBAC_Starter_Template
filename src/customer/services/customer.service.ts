import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { FilterCustomerDto } from '../dto/filter-customer.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerIndustry } from '../entities/customer-industry.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerIndustry)
    private customerIndustryRepository: Repository<CustomerIndustry>,
  ) {}

  async findAll(
    filterDto: FilterCustomerDto,
  ): Promise<{ customers: Customer[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      getAll,
      status,
      industryId,
      assignedTo,
    } = filterDto;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Customer> = {};
    const findOptions: FindManyOptions<Customer> = {
      relations: ['industry', 'assignedUser'],
      order: { createdAt: 'DESC' },
    };

    if (!getAll) {
      findOptions.take = limit;
      findOptions.skip = skip;
    }

    // Apply filters
    if (status) {
      whereConditions.status = status;
    }

    if (industryId) {
      whereConditions.industryId = industryId;
    }

    if (assignedTo) {
      whereConditions.assignedTo = assignedTo;
    }

    // Apply search
    if (search) {
      findOptions.where = [
        { ...whereConditions, fullName: Like(`%${search}%`) },
        { ...whereConditions, companyName: Like(`%${search}%`) },
        { ...whereConditions, email: Like(`%${search}%`) },
        { ...whereConditions, phone: Like(`%${search}%`) },
      ];
    } else {
      findOptions.where = whereConditions;
    }

    const [customers, total] =
      await this.customerRepository.findAndCount(findOptions);
    return { customers, total };
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['industry', 'assignedUser'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Check if email already exists
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const customerIndustry = await this.customerIndustryRepository.findOne({
      where: {
        id: createCustomerDto.industryId,
      },
    });

    if (!customerIndustry) {
      throw new NotFoundException(
        `Customer industry with ID ${createCustomerDto.industryId} not found`,
      );
    }

    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    // Check if email is being updated and if it already exists
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: updateCustomerDto.email },
      });

      if (existingCustomer) {
        throw new ConflictException('Customer with this email already exists');
      }
    }

    if (updateCustomerDto.industryId) {
      const customerIndustry = await this.customerIndustryRepository.findOne({
        where: {
          id: updateCustomerDto.industryId,
        },
      });

      if (!customerIndustry) {
        throw new NotFoundException(
          `Customer industry with ID ${updateCustomerDto.industryId} not found`,
        );
      }
    }

    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }
}
