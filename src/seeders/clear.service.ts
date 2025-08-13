import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { Permission } from '../auth/entities/permission.entity';
import { RolePermission } from '../auth/entities/role-permission.entity';

@Injectable()
export class ClearService {
  private readonly logger = new Logger(ClearService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async clearAll() {
    try {
      this.logger.log('Starting database clearing...');

      // Delete in order to respect foreign key constraints
      // 1. Delete users first (they reference roles)
      await this.clearUsers();

      // 2. Delete role-permission relationships
      await this.clearRolePermissions();

      // 3. Delete permissions
      await this.clearPermissions();

      // 4. Delete roles last
      await this.clearRoles();

      this.logger.log('Database clearing completed successfully!');
    } catch (error) {
      this.logger.error('Database clearing failed:', error);
      throw error;
    }
  }

  private async clearUsers() {
    const count = await this.userRepository.count();
    if (count > 0) {
      await this.userRepository.clear();
      this.logger.log(`Cleared ${count} users`);
    } else {
      this.logger.log('No users to clear');
    }
  }

  private async clearRolePermissions() {
    const count = await this.rolePermissionRepository.count();
    if (count > 0) {
      await this.rolePermissionRepository.clear();
      this.logger.log(`Cleared ${count} role-permission relationships`);
    } else {
      this.logger.log('No role-permission relationships to clear');
    }
  }

  private async clearPermissions() {
    const count = await this.permissionRepository.count();
    if (count > 0) {
      await this.permissionRepository.clear();
      this.logger.log(`Cleared ${count} permissions`);
    } else {
      this.logger.log('No permissions to clear');
    }
  }

  private async clearRoles() {
    const count = await this.roleRepository.count();
    if (count > 0) {
      await this.roleRepository.clear();
      this.logger.log(`Cleared ${count} roles`);
    } else {
      this.logger.log('No roles to clear');
    }
  }

  // Alternative method using TRUNCATE for faster clearing (PostgreSQL specific)
  async truncateAll() {
    try {
      this.logger.log('Starting database truncation...');

      // Disable foreign key checks temporarily
      await this.userRepository.query(
        'SET session_replication_role = replica;',
      );

      // Truncate all tables
      await this.userRepository.query(
        'TRUNCATE TABLE users RESTART IDENTITY CASCADE;',
      );
      await this.rolePermissionRepository.query(
        'TRUNCATE TABLE role_permissions RESTART IDENTITY CASCADE;',
      );
      await this.permissionRepository.query(
        'TRUNCATE TABLE permissions RESTART IDENTITY CASCADE;',
      );
      await this.roleRepository.query(
        'TRUNCATE TABLE roles RESTART IDENTITY CASCADE;',
      );

      // Re-enable foreign key checks
      await this.userRepository.query(
        'SET session_replication_role = DEFAULT;',
      );

      this.logger.log('Database truncation completed successfully!');
    } catch (error) {
      this.logger.error('Database truncation failed:', error);
      // Re-enable foreign key checks in case of error
      try {
        await this.userRepository.query(
          'SET session_replication_role = DEFAULT;',
        );
      } catch (resetError) {
        this.logger.error('Failed to reset foreign key checks:', resetError);
      }
      throw error;
    }
  }

  // Alternative method using query builder for more control
  async clearAllWithQueryBuilder() {
    try {
      this.logger.log('Starting database clearing with query builder...');

      // Delete users
      const userCount = await this.userRepository
        .createQueryBuilder()
        .delete()
        .execute();
      this.logger.log(`Cleared ${userCount.affected || 0} users`);

      // Delete role-permission relationships
      const rolePermCount = await this.rolePermissionRepository
        .createQueryBuilder()
        .delete()
        .execute();
      this.logger.log(
        `Cleared ${rolePermCount.affected || 0} role-permission relationships`,
      );

      // Delete permissions
      const permCount = await this.permissionRepository
        .createQueryBuilder()
        .delete()
        .execute();
      this.logger.log(`Cleared ${permCount.affected || 0} permissions`);

      // Delete roles
      const roleCount = await this.roleRepository
        .createQueryBuilder()
        .delete()
        .execute();
      this.logger.log(`Cleared ${roleCount.affected || 0} roles`);

      this.logger.log('Database clearing completed successfully!');
    } catch (error) {
      this.logger.error('Database clearing failed:', error);
      throw error;
    }
  }
}
