import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { TaskPersistedEntity } from '../entity';
import { CreateTaskDto, TaskFilterDto } from '../dto';
import { v4 as uuid } from 'uuid';
import { TaskStatus } from 'src/common';
import { UserPersistedEntity } from 'src/user/entities/user.persisted-entity';
import { AuthPayload } from 'src/auth/constant';

@Injectable()
export class TaskRepository extends Repository<TaskPersistedEntity> {
  constructor(private dataSource: DataSource) {
    super(TaskPersistedEntity, dataSource.createEntityManager());
  }
  /**
   * Creates new task
   * @param user - user creating the task
   * @param createTaskDto: DTO of the task to be created
   * @return - The created task.
   */
  async createTask(
    user: UserPersistedEntity,
    body: CreateTaskDto,
  ): Promise<TaskPersistedEntity> {
    const { title, description } = body;
    const task = this.create({
      id: uuid(),
      userId: user.id,
      title: title.toLowerCase(),
      description: description.toLowerCase(),
    } as TaskPersistedEntity);
    await this.save(task);
    return task;
  }

  /**
   * @query Task
   * @param user - user retrieving the task
   * @return - All Tasks
   */
  async fetchTask(
    taskFilterDto: TaskFilterDto,
  ): Promise<TaskPersistedEntity[]> {
    // return await this.query(`SELECT * FROM task`);
    // return await this.find();
    const { status, search } = taskFilterDto;

    const query = this.createQueryBuilder('task');
    //if status is passed as a search param
    if (status) query.andWhere('task.status = :status', { status });

    if (search)
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    const task = await query.getMany();
    return task;
  }

  /**
   * Retrieve Task by Id
   * @param id - Id of the task to be retrieved.
   * @returns - Task
   */
  async fetchTaskById(id: string): Promise<TaskPersistedEntity> {
    const task = await this.findOne({ where: { id } });
    if (!task) throw new NotFoundException();
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

  /**
   * Update Task
   * @param id- ID of the task to be updated
   * @param status - status to update the task to
   */
  async updateTaskStatus(id: string) {
    const task = await this.fetchTaskById(id);

    const updatedTask = await this.update(
      { id },
      {
        status:
          task.status !== TaskStatus.DONE
            ? TaskStatus.DONE
            : TaskStatus.IN_PROGRESS,
      },
    );

    if (!(updatedTask.affected > 0)) {
      throw new BadRequestException();
    }
    return {
      status: 'success',
    };
  }
}
