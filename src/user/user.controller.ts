import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  NotFoundException,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ResponseUtil, ApiResponse } from '../common';
import { User } from './entities/user.entity';
import { FilterUserDto } from './dto/filter-user.dto';

@Controller('api/users')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query() filterDto: FilterUserDto,
  ): Promise<ApiResponse<User[]>> {
    const { data, total } = await this.userService.findAll(filterDto);

    return ResponseUtil.paginated(
      data,
      total,
      filterDto.page || 1,
      filterDto.limit || 10,
      'Users retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
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

  @Patch(':id')
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
