import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto';
import { ResponseUtil, ApiResponse } from '../../common';
import { Role } from '../entities/role.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { PermissionModule } from '../entities/permission.entity';

@Controller('api/roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @RequirePermissions({
    module: PermissionModule.ROLES,
    permission: 'read',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ApiResponse<Role[]>> {
    const [roles, total] = await Promise.all([
      this.roleService.findAll(page, limit),
      this.roleService.count(),
    ]);

    return ResponseUtil.paginated(
      roles,
      total,
      page,
      limit,
      'Roles retrieved successfully',
    );
  }

  @Get('permissions')
  @RequirePermissions({
    module: PermissionModule.PERMISSIONS,
    permission: 'read',
  })
  async findAllPermissions() {
    const permissions = await this.roleService.findAllPermissions();

    return ResponseUtil.success(
      permissions,
      'Permissions retrieved successfully',
    );
  }

  @Get(':id')
  @RequirePermissions({
    module: PermissionModule.ROLES,
    permission: 'read',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Role>> {
    const role = await this.roleService.findOne(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return ResponseUtil.success(role, 'Role retrieved successfully');
  }

  @Post()
  @RequirePermissions({
    module: PermissionModule.ROLES,
    permission: 'create',
  })
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ApiResponse<Role | null>> {
    const role = await this.roleService.create(createRoleDto);
    if (!role) {
      return ResponseUtil.error('Role creation failed');
    }

    return ResponseUtil.created(role, 'Role created successfully');
  }

  @Patch(':id')
  @RequirePermissions({
    module: PermissionModule.ROLES,
    permission: 'update',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ApiResponse<Role>> {
    const role = await this.roleService.update(id, updateRoleDto);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return ResponseUtil.updated(role, 'Role updated successfully');
  }

  @Delete(':id')
  @RequirePermissions({
    module: PermissionModule.ROLES,
    permission: 'delete',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    const deleted = await this.roleService.remove(id);

    if (!deleted) {
      throw new NotFoundException('Role not found');
    }

    return ResponseUtil.deleted('Role deleted successfully');
  }
}
