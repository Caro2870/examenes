import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { Plan } from '../../entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Plan])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

