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
import { CustomerIndustry } from './customer-industry.entity';
import { User } from '../../user/entities/user.entity';
import { Quotation } from 'src/quotation/entities/quotation.entity';

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  VIP = 'VIP',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  companyName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne(
    () => CustomerIndustry,
    (customerIndustry) => customerIndustry.customers,
  )
  @JoinColumn({ name: 'industryId' })
  industry: CustomerIndustry;

  @Column({ nullable: false })
  industryId: number;

  @Column({ default: 0 })
  totalValue: number;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE,
  })
  status: CustomerStatus;

  @Column({ nullable: true })
  website: string;

  @ManyToOne(() => User, (user) => user.assignedCustomers, { nullable: true })
  @JoinColumn({ name: 'assignedTo' })
  assignedUser: User;

  @Column({ nullable: true })
  assignedTo: number;

  @OneToMany(() => Quotation, (quotation) => quotation.customer, {
    nullable: true,
  })
  quotations: Quotation[];

  @Column({ nullable: true })
  tags: string; // comma separated values

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
