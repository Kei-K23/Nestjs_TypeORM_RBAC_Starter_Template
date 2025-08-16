import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Like,
  FindManyOptions,
  FindOptionsWhere,
  Between,
} from 'typeorm';
import { Quotation } from '../entities/quotation.entity';
import { QuotationItem } from '../entities/quotation-item.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { FilterQuotationDto } from '../dto/filter-quotation.dto';
import { CreateQuotationDto } from '../dto/create-quotation.dto';

@Injectable()
export class QuotationService {
  constructor(
    @InjectRepository(Quotation)
    private quotationRepository: Repository<Quotation>,
    @InjectRepository(QuotationItem)
    private quotationItemRepository: Repository<QuotationItem>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findAll(
    filterDto: FilterQuotationDto,
  ): Promise<{ quotations: Quotation[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      getAll,
      customerId,
      quotationFormat,
      validFromDate,
      validToDate,
    } = filterDto;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Quotation> = {};
    const findOptions: FindManyOptions<Quotation> = {
      relations: ['customer', 'items'],
      order: { createdAt: 'DESC' },
    };

    if (!getAll) {
      findOptions.take = limit;
      findOptions.skip = skip;
    }

    // Apply filters
    if (customerId) {
      whereConditions.customerId = customerId;
    }

    if (quotationFormat) {
      whereConditions.quotationFormat = quotationFormat;
    }

    if (validFromDate && validToDate) {
      whereConditions.validUntilAt = Between(
        new Date(validFromDate),
        new Date(validToDate),
      );
    } else if (validFromDate) {
      whereConditions.validUntilAt = Between(
        new Date(validFromDate),
        new Date(),
      );
    }

    // Apply search
    if (search) {
      findOptions.where = [
        { ...whereConditions, quotationNumber: Like(`%${search}%`) },
        { ...whereConditions, customerName: Like(`%${search}%`) },
        { ...whereConditions, customerCompanyName: Like(`%${search}%`) },
        { ...whereConditions, customerEmail: Like(`%${search}%`) },
      ];
    } else {
      findOptions.where = whereConditions;
    }

    const [quotations, total] =
      await this.quotationRepository.findAndCount(findOptions);

    return { quotations, total };
  }

  async findOne(id: number): Promise<Quotation> {
    const quotation = await this.quotationRepository.findOne({
      where: { id },
      relations: ['customer', 'items'],
    });

    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${id} not found`);
    }

    return quotation;
  }

  async create(createQuotationDto: CreateQuotationDto): Promise<Quotation> {
    const { items, customerId, ...quotationData } = createQuotationDto;

    // Check if quotation number already exists
    const existingQuotation = await this.quotationRepository.findOne({
      where: { quotationNumber: createQuotationDto.quotationNumber },
    });

    if (existingQuotation) {
      throw new ConflictException(
        `Quotation with number '${createQuotationDto.quotationNumber}' already exists`,
      );
    }

    // Validate customer if customerId is provided
    if (customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }
    }

    // Create quotation
    const quotation = this.quotationRepository.create({
      ...quotationData,
      customerId,
      validUntilAt: new Date(createQuotationDto.validUntilAt),
    });

    const savedQuotation = await this.quotationRepository.save(quotation);

    // Create quotation items
    if (items && items.length > 0) {
      const quotationItems = items.map((item) =>
        this.quotationItemRepository.create({
          ...item,
          quotationId: savedQuotation.id,
        }),
      );
      await this.quotationItemRepository.save(quotationItems);
    }

    return this.findOne(savedQuotation.id);
  }
}
