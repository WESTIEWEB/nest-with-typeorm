import { Injectable } from '@nestjs/common';
import { Task } from '../model/tasks.model';
import { v4 as uuid } from 'uuid';
import { GetTaskFilterDto, UpdateTaskDto } from '../dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  async getAllTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async getTasksWithFilters(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    let tasks = await this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    return this.tasks.find((task) => task.id === id);
  }

  async createTask(body: Task): Promise<Task> {
    const { title, description } = body;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: 'OPEN',
    } as Task;
    this.tasks.push(task);
    return task;
  }

  async updateTask(body: UpdateTaskDto, id: string): Promise<Task> {
    const { status } = body;
    const task = this.tasks.find((task) => task.id === id);
    task.status = status;
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
