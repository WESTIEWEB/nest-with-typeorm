import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { TaskPersistedEntity } from '../entity';
import { CreateTaskDto } from '../dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TaskRepository extends Repository<TaskPersistedEntity> {
  constructor(private dataSource: DataSource) {
    super(TaskPersistedEntity, dataSource.createEntityManager());
  }
  async createTask(body: CreateTaskDto): Promise<TaskPersistedEntity> {
    const { title, description } = body;
    const task = this.create({
      id: uuid(),
      title,
      description,
    } as TaskPersistedEntity);
    await this.save(task);
    return task;
  }

  async fetchTask(): Promise<TaskPersistedEntity[]> {
    // return await this.query(`SELECT * FROM task`);
    return await this.find();
  }

  async fetchTaskById(id: string): Promise<TaskPersistedEntity> {
    const task = await this.findOne({ where: { id } });
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await this.delete(id);
  }
}
