import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { QuotationService } from '../services/quotation.service';
import { CreateQuotationDto } from '../dto/create-quotation.dto';
import { FilterQuotationDto } from '../dto/filter-quotation.dto';
import { ResponseUtil } from 'src/common';

@Controller('api/quotations')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createQuotationDto: CreateQuotationDto) {
    const quotation = await this.quotationService.create(createQuotationDto);
    return ResponseUtil.success(quotation, 'Quotation created successfully');
  }

  @Get()
  async findAll(@Query() filterDto: FilterQuotationDto) {
    const result = await this.quotationService.findAll(filterDto);

    if (filterDto.getAll) {
      return ResponseUtil.success(
        result.quotations,
        'All quotations retrieved successfully',
      );
    }

    return ResponseUtil.paginated(
      result.quotations,
      result.total,
      filterDto.page || 1,
      filterDto.limit || 10,
      'Quotations retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const quotation = await this.quotationService.findOne(id);
    return ResponseUtil.success(quotation, 'Quotation retrieved successfully');
  }
}
