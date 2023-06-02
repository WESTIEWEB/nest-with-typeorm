import { Injectable } from '@nestjs/common';
import { TaskRepository } from './repository';
import { TaskPersistedEntity } from './entity';
import { CreateTaskDto, TaskFilterDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  // private tasks: Task[] = [];
  // async getAllTasks(): Promise<Task[]> {
  //   return this.tasks;
  // }
  // async getTasksWithFilters(filterDto: GetTaskFilterDto): Promise<Task[]> {
  //   const { status, search } = filterDto;
  //   let tasks = await this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.toLowerCase().includes(search.toLowerCase()) ||
  //         task.description.toLowerCase().includes(search.toLowerCase()),
  //     );
  //   }
  //   return tasks;
  // }
  async getTasks(taskFilterDto: TaskFilterDto): Promise<TaskPersistedEntity[]> {
    return await this.taskRepository.fetchTask(taskFilterDto);
  }

  async getTaskById(id: string): Promise<TaskPersistedEntity> {
    return await this.taskRepository.fetchTaskById(id);
  }

  async createTask(body: CreateTaskDto): Promise<TaskPersistedEntity> {
    return await this.taskRepository.createTask(body);
  }
  // async createTask(body: CreateTaskDto): Promise<Task> {
  //   const { title, description } = body;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: 'OPEN',
  //   } as Task;
  //   this.tasks.push(task);
  //   return task;
  // }
  async updateTask(id: string) {
    return await this.taskRepository.updateTaskStatus(id);
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.deleteTask(id);
  }
}
