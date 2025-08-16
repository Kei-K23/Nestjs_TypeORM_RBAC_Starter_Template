import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Lead } from 'src/leads/entities/lead.entity';

@Entity('customer_industries')
export class CustomerIndustry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Customer, (customer) => customer.industry)
  customers: Customer[];

  @OneToMany(() => Lead, (lead) => lead.industry)
  leads: Lead[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
