import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { TasksModule } from 'src/tasks/tasks.module';
import { TaskRepository } from '../tasks/repository/task.repository';
import { TaskController } from './task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), TasksModule],
  controllers: [UserController, TaskController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
