import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthSeeder } from '../auth/seeders/auth.seeder';
import { Role } from '../auth/entities/role.entity';
import { Permission } from '../auth/entities/permission.entity';
import { RolePermission } from '../auth/entities/role-permission.entity';
import { User } from '../user/entities/user.entity';
import { SeederService } from './seeder.service';
import { ClearService } from './clear.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
    TypeOrmModule.forFeature([User, Role, Permission, RolePermission]),
  ],
  providers: [AuthSeeder, SeederService, ClearService],
})
export class SeederModule {}
