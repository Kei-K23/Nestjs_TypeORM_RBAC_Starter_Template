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
import { LeadCategory } from './lead-category.entity';

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
  companyName: string;

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
  categoryId: number;

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

  @ManyToOne(() => LeadCategory, (category) => category.leads)
  @JoinColumn({ name: 'categoryId' })
  category: LeadCategory;

  @ManyToOne(() => User, (user) => user.assignedLeads)
  @JoinColumn({ name: 'assignedTo' })
  assignedUser: User;

  @OneToMany(() => LeadActivity, (activity) => activity.lead)
  activities: LeadActivity[];

  @Column({ default: 0 })
  leadStageDurationInDays: number;

  @Column({ default: 0 })
  quotationStageDurationInDays: number;

  @Column({ default: 0 })
  negotiationStageDurationInDays: number;

  @Column({ default: 0 })
  closeWonStageDurationInDays: number;

  @CreateDateColumn()
  latestChangedStageAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
