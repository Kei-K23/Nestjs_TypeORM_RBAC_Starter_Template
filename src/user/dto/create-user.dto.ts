import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { UserDepartmentType, UserStatusType } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(3, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsEnum(UserStatusType, { message: 'Invalid status value' })
  status?: UserStatusType;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @IsNotEmpty({ message: 'Department is required' })
  @IsString({ message: 'Department must be a string' })
  @IsEnum(UserDepartmentType, { message: 'Invalid department value' })
  department?: UserDepartmentType;

  @IsOptional()
  @IsString({ message: 'Note must be a string' })
  note?: string;

  @IsNotEmpty({ message: 'Role ID is required' })
  @IsNumber({}, { message: 'Role ID must be a number' })
  roleId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Monthly target must be a number' })
  monthlyTarget?: number;
}
