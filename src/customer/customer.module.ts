import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerIndustry } from './entities/customer-industry.entity';
import { CustomerService } from './services/customer.service';
import { CustomerIndustryService } from './services/customer-industry.service';
import { CustomerController } from './controllers/customer.controller';
import { CustomerIndustryController } from './controllers/customer-industry.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerIndustry])],
  controllers: [CustomerController, CustomerIndustryController],
  providers: [CustomerService, CustomerIndustryService],
  exports: [CustomerService, CustomerIndustryService],
})
export class CustomerModule {}
