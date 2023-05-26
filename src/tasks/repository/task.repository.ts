import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { TaskPersistedEntity } from '../entity';
import { CreateTaskDto } from '../dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TaskRepository extends Repository<TaskPersistedEntity> {
  constructor(private dataSource: DataSource) {
    super(TaskPersistedEntity, dataSource.createEntityManager());
  }
  /**
   * Creates new task
   * @param createTaskDto: DTO of the task to be created
   * @return - The created task.
   */
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

  /**
   * @query Task
   * @return - All Tasks
   */
  async fetchTask(): Promise<TaskPersistedEntity[]> {
    // return await this.query(`SELECT * FROM task`);
    return await this.find();
  }

  /**
   * Retrieve Task by Id
   * @param id - Id of the task to be retrieved.
   * @returns - Task
   */
  async fetchTaskById(id: string): Promise<TaskPersistedEntity> {
    const task = await this.findOne({ where: { id } });

    if (!task) throw new BadRequestException(`Task not Found`);

    return task;
  }

  /**
   * Delete Task by Id
   * @param id - Id of the task to be deleted
   */
  async deleteTask(id: string): Promise<void> {
    const task = await this.fetchTaskById(id);
    await this.delete(task.id);
  }
}
