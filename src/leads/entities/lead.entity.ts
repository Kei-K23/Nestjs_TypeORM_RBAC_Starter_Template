import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { LeadActivity } from './lead-activity.entity';

export enum LeadStageType {
  LEAD = 'lead',
  QUOTATION = 'quotation',
  NEGOTIATION = 'negotiation',
  CLOSE_WON = 'close won',
  LOST = 'lost',
}

export enum CustomerType {
  NEW = 'new',
  EXISTING = 'existing',
}

export enum CategoryType {
  ENTERPRISE_SOFTWARE = 'enterprise software',
  STARTUP_PACKAGE = 'startup package',
  CUSTOM_DEVELOPMENT = 'custom development',
}

export enum LeadSourceType {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  EMAIL_CAMPAIGN = 'email_campaign',
  COLD_CALL = 'cold_call',
  TRADE_SHOW = 'trade_show',
  OTHER = 'other',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  customerFullName: string;

  @Column({ nullable: true })
  customerJobTitle: string;

  @Column({ nullable: false })
  company: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true })
  dealValue: number;

  @Column({ default: LeadStageType.LEAD })
  leadStage: LeadStageType;

  @Column({ default: 0 })
  position: number;

  @Column({ nullable: false })
  category: CategoryType;

  @Column({ nullable: false })
  customerType: CustomerType;

  @Column({ nullable: false })
  serviceDescription: string;

  @Column({ nullable: true })
  leadSource: LeadSourceType;

  @Column()
  assignedTo: number;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  websiteLink: string;

  @ManyToOne(() => User, (user) => user.assignedLeads)
  @JoinColumn({ name: 'assignedTo' })
  assignedUser: User;

  @OneToMany(() => LeadActivity, (activity) => activity.lead)
  activities: LeadActivity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
