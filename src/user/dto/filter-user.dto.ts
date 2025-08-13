import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDepartmentType, UserStatusType } from '../entities/user.entity';

export class FilterUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @IsOptional()
  @IsEnum(UserDepartmentType, { message: 'Invalid department value' })
  department?: UserDepartmentType;

  @IsOptional()
  @IsEnum(UserStatusType, { message: 'Invalid status value' })
  status?: UserStatusType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Role ID must be a number' })
  roleId?: number;
}
