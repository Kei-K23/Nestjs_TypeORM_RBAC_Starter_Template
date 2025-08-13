import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from '../entities/role.entity';
import { Permission, PermissionType } from '../entities/permission.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthSeeder {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    // Create roles
    const adminRole = await this.createRole('admin', 'Administrator role');

    // Create permissions
    const userPermissions = await this.createModulePermissions('users');
    const rolePermissions = await this.createModulePermissions('roles');
    const permissionPermissions =
      await this.createModulePermissions('permissions');

    // Assign permissions to roles
    // Admin gets all permissions
    await this.assignPermissionsToRole(adminRole, [
      ...userPermissions,
      ...rolePermissions,
      ...permissionPermissions,
    ]);

    // Create admin user
    await this.createAdminUser(adminRole);
  }

  private async createRole(name: string, description: string): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({ where: { name } });
    if (existingRole) {
      return existingRole;
    }

    const role = this.roleRepository.create({ name, description });
    return this.roleRepository.save(role);
  }

  private async createModulePermissions(module: string): Promise<Permission[]> {
    const permissions: Permission[] = [];

    for (const permissionType of Object.values(PermissionType)) {
      if (typeof permissionType === 'number') {
        const existingPermission = await this.permissionRepository.findOne({
          where: { module, permission: permissionType },
        });

        if (!existingPermission) {
          const permission = this.permissionRepository.create({
            module,
            permission: permissionType,
          });
          permissions.push(await this.permissionRepository.save(permission));
        } else {
          permissions.push(existingPermission);
        }
      }
    }

    return permissions;
  }

  private async assignPermissionsToRole(
    role: Role,
    permissions: Permission[],
  ): Promise<void> {
    for (const permission of permissions) {
      if (permission) {
        const existingRolePermission =
          await this.rolePermissionRepository.findOne({
            where: { roleId: role.id, permissionId: permission.id },
          });

        if (!existingRolePermission) {
          const rolePermission = this.rolePermissionRepository.create({
            roleId: role.id,
            permissionId: permission.id,
          });
          await this.rolePermissionRepository.save(rolePermission);
        }
      }
    }
  }

  private async createAdminUser(adminRole: Role): Promise<void> {
    const existingAdmin = await this.userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);

      const admin = this.userRepository.create({
        email: 'admin@example.com',
        fullName: 'Admin',
        password: hashedPassword,
        roleId: adminRole.id,
        isActive: true,
      });

      await this.userRepository.save(admin);
    }
  }
}
