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
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create_task.dto';
import { TaskPersistedEntity } from './entity/task.persisted-entity';
import { TaskFilterDto } from './dto';

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
  // }zz
  @Get()
  @UsePipes(ValidationPipe)
  async getTasks(
    @Query()
    taskFilterDto: TaskFilterDto
  ): Promise<TaskPersistedEntity[]> {
    return await this.tasksService.getTasks(taskFilterDto);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<TaskPersistedEntity> {
    return await this.tasksService.getTaskById(id);
  }

  @Patch('/:id')
  async updateTask(@Param('id') id: string) {
    return await this.tasksService.updateTask(id);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.tasksService.deleteTask(id);
  }
}
