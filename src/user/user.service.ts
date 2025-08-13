import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<User[]> {
    const skip = (page - 1) * limit;
    return this.userRepository.find({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);

    if (!user) {
      return null;
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.findOne(id);

    if (!user) {
      return false;
    }

    await this.userRepository.delete(id);
    return true;
  }
}
