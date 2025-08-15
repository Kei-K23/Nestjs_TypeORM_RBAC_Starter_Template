import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { CustomerIndustry } from '../entities/customer-industry.entity';
import { FilterCustomerIndustryDto } from '../dto/filter-customer-industry.dto';
import { CreateCustomerIndustryDto } from '../dto/create-customer-industry.dto';
import { UpdateCustomerIndustryDto } from '../dto/update-customer-industry.dto';

@Injectable()
export class CustomerIndustryService {
  constructor(
    @InjectRepository(CustomerIndustry)
    private customerIndustryRepository: Repository<CustomerIndustry>,
  ) {}

  async findAll(
    filterDto: FilterCustomerIndustryDto,
  ): Promise<{ industries: CustomerIndustry[]; total: number }> {
    const { page = 1, limit = 10, search, getAll } = filterDto;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<CustomerIndustry> = {};
    const findOptions: FindManyOptions<CustomerIndustry> = {
      order: { createdAt: 'DESC' },
    };

    if (!getAll) {
      findOptions.take = limit;
      findOptions.skip = skip;
    }

    // Apply search
    if (search) {
      findOptions.where = [
        { ...whereConditions, name: Like(`%${search}%`) },
        { ...whereConditions, description: Like(`%${search}%`) },
      ];
    } else {
      findOptions.where = whereConditions;
    }

    const [industries, total] =
      await this.customerIndustryRepository.findAndCount(findOptions);
    return { industries, total };
  }

  async findOne(id: number): Promise<CustomerIndustry> {
    const industry = await this.customerIndustryRepository.findOne({
      where: { id },
      relations: ['customers'],
    });

    if (!industry) {
      throw new NotFoundException(`Customer Industry with ID ${id} not found`);
    }

    return industry;
  }

  async create(
    createCustomerIndustryDto: CreateCustomerIndustryDto,
  ): Promise<CustomerIndustry> {
    // Check if name already exists
    const existingIndustry = await this.customerIndustryRepository.findOne({
      where: { name: createCustomerIndustryDto.name },
    });

    if (existingIndustry) {
      throw new ConflictException(
        'Customer Industry with this name already exists',
      );
    }

    const industry = this.customerIndustryRepository.create(
      createCustomerIndustryDto,
    );
    return await this.customerIndustryRepository.save(industry);
  }

  async update(
    id: number,
    updateCustomerIndustryDto: UpdateCustomerIndustryDto,
  ): Promise<CustomerIndustry> {
    const industry = await this.findOne(id);

    // Check if name is being updated and if it already exists
    if (
      updateCustomerIndustryDto.name &&
      updateCustomerIndustryDto.name !== industry.name
    ) {
      const existingIndustry = await this.customerIndustryRepository.findOne({
        where: { name: updateCustomerIndustryDto.name },
      });

      if (existingIndustry) {
        throw new ConflictException(
          'Customer Industry with this name already exists',
        );
      }
    }

    Object.assign(industry, updateCustomerIndustryDto);
    return await this.customerIndustryRepository.save(industry);
  }

  async remove(id: number): Promise<void> {
    const industry = await this.customerIndustryRepository.findOne({
      where: { id },
      relations: ['customers'],
    });

    if (!industry) {
      throw new NotFoundException(`Customer Industry with ID ${id} not found`);
    }

    // Check if industry has associated customers
    if (industry.customers && industry.customers.length > 0) {
      throw new BadRequestException(
        'Cannot delete industry that has associated customers. Please reassign or remove customers first.',
      );
    }

    await this.customerIndustryRepository.remove(industry);
  }
}
