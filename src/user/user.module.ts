import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SalesUser } from './entities/sales-user.entity';
import { Role } from 'src/auth/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SalesUser, Role])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
