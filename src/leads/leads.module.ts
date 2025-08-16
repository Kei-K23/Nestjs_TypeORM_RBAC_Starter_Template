import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from './controllers/leads.controller';
import { LeadCategoryController } from './controllers/lead-category.controller';
import { LeadsService } from './services/leads.service';
import { Lead } from './entities/lead.entity';
import { LeadActivity } from './entities/lead-activity.entity';
import { User } from 'src/user/entities/user.entity';
import { LeadCategory } from './entities/lead-category.entity';
import { LeadCategoryService } from './services/lead-category.service';
import { CustomerIndustry } from 'src/customer/entities/customer-industry.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lead,
      LeadActivity,
      User,
      LeadCategory,
      CustomerIndustry,
      Customer,
    ]),
  ],
  controllers: [LeadsController, LeadCategoryController],
  providers: [LeadsService, LeadCategoryService],
  exports: [LeadsService, LeadCategoryService],
})
export class LeadsModule {}
