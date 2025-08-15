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

@Module({
  imports: [TypeOrmModule.forFeature([Lead, LeadActivity, User, LeadCategory])],
  controllers: [LeadsController, LeadCategoryController],
  providers: [LeadsService, LeadCategoryService],
  exports: [LeadsService, LeadCategoryService],
})
export class LeadsModule {}
