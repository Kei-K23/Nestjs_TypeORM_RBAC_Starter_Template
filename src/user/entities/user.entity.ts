import { Exclude } from 'class-transformer';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Role } from 'src/auth/entities/role.entity';
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

export enum UserStatusType {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export enum UserDepartmentType {
  SALES = 'sales',
  MARKETING = 'marketing',
  FINANCE = 'finance',
  HR = 'HR',
  IT = 'IT',
  OPERATIONS = 'operations',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: UserStatusType.ACTIVE })
  status: UserStatusType;

  @Column({ default: UserDepartmentType.IT })
  department: UserDepartmentType;

  @Column({ nullable: true })
  note: string;

  @Column()
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
