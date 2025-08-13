import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User, UserDepartmentType } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { SalesUser } from './entities/sales-user.entity';
import { Role } from 'src/auth/entities/role.entity';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SalesUser)
    private salesUserRepository: Repository<SalesUser>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(
    filterDto: FilterUserDto,
  ): Promise<{ data: User[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      department,
      status,
      roleId,
    } = filterDto;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<User> = {};
    const findOptions: FindManyOptions<User> = {
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['role'],
    };

    // Apply filters
    if (department) {
      whereConditions.department = department;
    }

    if (status) {
      whereConditions.status = status;
    }

    if (roleId) {
      whereConditions.roleId = roleId;
    }

    // Apply search (search in fullName, email)
    if (search) {
      findOptions.where = [
        { ...whereConditions, fullName: Like(`%${search}%`) },
        { ...whereConditions, email: Like(`%${search}%`) },
      ];
    } else {
      findOptions.where = whereConditions;
    }

    const [users, total] = await this.userRepository.findAndCount(findOptions);

    return { data: users, total };
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }

  async findOne(id: number): Promise<Omit<User, 'password'> | null> {
    return await this.findUserWithDepartmentData(id);
  }

  async findUserWithDepartmentData(
    id: number,
  ): Promise<
    | Omit<User, 'password'>
    | (Omit<User, 'password'> & { userDepartmentData: SalesUser | null })
  > {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Exclude password from user object
    const { password, ...userWithoutPassword } = user;
    void password;
    switch (user.department) {
      case UserDepartmentType.SALES: {
        const salesData = await this.salesUserRepository.findOne({
          where: { user: { id } },
        });

        return { ...userWithoutPassword, userDepartmentData: salesData };
      }

      // TODO: Add cases for other departments
      // case UserDepartmentType.MARKETING:
      //   const marketingData = await this.marketingUserRepository.findOne({
      //     where: { user: { id } }
      //   });
      //   return { ...userWithoutPassword, departmentData: marketingData };

      default:
        return userWithoutPassword;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check role exist
    const role = await this.roleRepository.findOne({
      where: { id: createUserDto.roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    if (createUserDto.department === UserDepartmentType.SALES) {
      const salesUser = this.salesUserRepository.create({
        monthlyTarget: 10000, // TODO: Change to real user input
        user: savedUser,
      });
      await this.salesUserRepository.save(salesUser);
    }

    return savedUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);

    if (!user) {
      return null;
    }

    if (updateUserDto.roleId) {
      // Check role exist
      const role = await this.roleRepository.findOne({
        where: { id: updateUserDto.roleId },
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.findOne(id);

    if (!user) {
      return false;
    }

    // Check if user is sales user
    if (user.department === UserDepartmentType.SALES) {
      const salesUser = await this.salesUserRepository.findOne({
        where: { user: { id } },
      });

      if (salesUser) {
        await this.salesUserRepository.delete(salesUser.id);
      }
    }

    // TODO: Add delete for other department user type

    await this.userRepository.delete(id);
    return true;
  }
}
