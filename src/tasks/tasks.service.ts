import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { TaskRepository } from './repository';
import { TaskPersistedEntity } from './entity';
import { CreateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}
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
  // async updateTask(status: TaskStatus, id: string): Promise<Task> {
  //   const task = await this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
  // async deleteTask(id: string): Promise<void> {
  //   const isFound = await this.getTaskById(id);
  //   delete this.tasks[this.tasks.indexOf(isFound)];
  // }
}
