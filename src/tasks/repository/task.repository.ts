import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskPersistedEntity } from '../entity';
import { CreateTaskDto } from '../dto';

@Injectable()
export class TaskRepository extends Repository<TaskPersistedEntity> {
  constructor() {
    super();
  }
  async createTask(body: CreateTaskDto): Promise<TaskPersistedEntity> {
    const { title, description } = body;
    const task = this.create({
      title,
      description,
    } as TaskPersistedEntity);
    await this.save(task);
    return task;
  }

  async fetchTaskById(id: string): Promise<TaskPersistedEntity> {
    const isFound = await this.findOne({
      where: { id },
    });
    if (!isFound) {
      throw new NotFoundException(`Task with the id ${id} doesn't exist`);
    }
    return isFound;
  }
}
