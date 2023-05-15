/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create_task.dto';
import { TaskPersistedEntity } from './entity/task.persisted-entity';

@Controller('tasks/api/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Get()
  // @UsePipes(ValidationPipe)
  // getTasksWithFilters(@Query() params: GetTaskFilterDto): Promise<Task[]> {
  //   console.log(params);
  //   if (Object.keys(params).length) {
  //     return this.tasksService.getTasksWithFilters(params);
  //   } else {
  //     return this.tasksService.getAllTasks();
  //   }
  // }
  @Get()
  async getTasks(): Promise<TaskPersistedEntity[]> {
    return await  this.tasksService.getTasks();
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<TaskPersistedEntity> {
    return await this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(
    @Body()
    params: CreateTaskDto,
  ): Promise<TaskPersistedEntity> {
    return await this.tasksService.createTask(params);
  }

  // @Put('/:id')
  // updateTask(
  //   @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  //   @Param('id') id: string,
  // ): Promise<Task> {
  //   return this.tasksService.updateTask(status, id);
  // }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.tasksService.deleteTask(id);
  }
}