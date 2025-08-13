import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lead } from './lead.entity';
import { User } from 'src/user/entities/user.entity';

export enum ActivityActionType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  FOLLOW_UP = 'follow_up',
  PROPOSAL_SENT = 'proposal_sent',
  CONTRACT_SIGNED = 'contract_signed',
  PAYMENT_RECEIVED = 'payment_received',
  LEAD_QUALIFIED = 'lead_qualified',
  LEAD_DISQUALIFIED = 'lead_disqualified',
  OTHER = 'other',
}

@Entity('lead_activities')
export class LeadActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  leadId: number;

  @Column({ nullable: true })
  action: ActivityActionType;

  @Column({ nullable: true })
  description: string;

  @Column()
  actionBy: number;

  @ManyToOne(() => Lead, (lead: Lead) => lead.activities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @ManyToOne(() => User, (user) => user.leadActivities)
  @JoinColumn({ name: 'actionBy' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
