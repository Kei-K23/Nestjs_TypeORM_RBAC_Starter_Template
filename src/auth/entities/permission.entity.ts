import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';

export enum PermissionType {
  CREATE = 1,
  READ = 2,
  UPDATE = 3,
  DELETE = 4,
}

export enum PermissionModule {
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  ADMINS = 'admins',
}

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  module: string;

  @Column({ type: 'int' })
  permission: PermissionType;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
