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
import { TasksService } from '../services/tasks.service';
import { Task, TaskStatus } from '../model/tasks.model';
import { CreateTaskDto } from '../dto/create_task.dto';
import { GetTaskFilterDto } from '../dto';
import { TaskStatusValidationPipe } from '../pipes/custom-pipes';

@Controller('tasks/api/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getTasksWithFilters(@Query() params: GetTaskFilterDto): Promise<Task[]> {
    console.log(params);
    if (Object.keys(params).length) {
      return this.tasksService.getTasksWithFilters(params);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body()
    params: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createTask(params);
  }

  @Put('/:id')
  updateTask(
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @Param('id') id: string,
  ): Promise<Task> {
    return this.tasksService.updateTask(status, id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
