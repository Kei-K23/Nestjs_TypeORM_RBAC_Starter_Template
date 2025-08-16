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
import { Customer } from '../../customer/entities/customer.entity';
import { QuotationItem } from './quotation-item.entity';

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  quotationNumber: string;

  @Column({ type: 'date', nullable: false })
  validUntilAt: Date;

  @Column({ nullable: false })
  quotationFormat: string;

  @ManyToOne(() => Customer, (customer) => customer.quotations, {
    nullable: true,
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ nullable: true })
  customerId: number;

  @Column({ nullable: false })
  customerName: string;

  @Column({ nullable: false })
  customerCompanyName: string;

  @Column({ nullable: false })
  customerEmail: string;

  @Column({ nullable: false })
  customerPhone: string;

  @Column({ nullable: false })
  customerAddress: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => QuotationItem, (item) => item.quotation, {
    cascade: true,
    eager: true,
  })
  items: QuotationItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
