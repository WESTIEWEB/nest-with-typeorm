import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { UserTaskDto } from './dto/user_task.dto';
import { TaskPersistedEntity } from 'src/tasks/entity';
import { UserPersistedEntity } from './entities/user.persisted-entity';
import { TaskRepository } from 'src/tasks/repository';
import { AuthPayload } from 'src/auth/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  /**
   * createTask
   * @param user - User to create task for
   * @param createTaskDto - DTO of task to be created
   * @returns - The created Task
   */
  async createTaskForUser(
    user: AuthPayload,
    taskDto: UserTaskDto,
  ): Promise<TaskPersistedEntity> {
    return await this.taskRepository.createTask(user, taskDto);
  }

  async getUserById(id: string): Promise<UserPersistedEntity> {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }
}
