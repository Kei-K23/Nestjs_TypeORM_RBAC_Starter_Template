import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ValidationPipe,
  UsePipes,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ResponseUtil, ApiResponse } from '../common';
import { User } from './entities/user.entity';

@Controller('api/users')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ApiResponse<User[]>> {
    const [users, total] = await Promise.all([
      this.userService.findAll(page, limit),
      this.userService.count(),
    ]);

    return ResponseUtil.paginated(
      users,
      total,
      page,
      limit,
      'Users retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<User>> {
    const user = await this.userService.findOne(+id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ResponseUtil.success(user, 'User retrieved successfully');
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User>> {
    const user = await this.userService.create(createUserDto);
    return ResponseUtil.created(user, 'User created successfully');
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    const user = await this.userService.update(+id, updateUserDto);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ResponseUtil.updated(user, 'User updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    const deleted = await this.userService.remove(+id);

    if (!deleted) {
      throw new NotFoundException('User not found');
    }

    return ResponseUtil.deleted('User deleted successfully');
  }
}
