/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create_task.dto';
import { TaskPersistedEntity } from './entity/task.persisted-entity';
import { TaskFilterDto } from './dto';
import { AuthGuard, GetUser } from 'src/auth';
import { UserPersistedEntity } from 'src/user/entities/user.persisted-entity';

@Controller('task/api/v1')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('create-task')
  @UsePipes(ValidationPipe)
  async createTask(@Body() params: CreateTaskDto, @GetUser() user: UserPersistedEntity): Promise<TaskPersistedEntity> {
    return await this.tasksService.createTask(user, params);
  }
  @Get('tasks')
  @UsePipes(ValidationPipe)
  async getTasks(
    @GetUser() user: UserPersistedEntity,
    @Query() taskFilterDto: TaskFilterDto
  ): Promise<TaskPersistedEntity[]> {
    return await this.tasksService.getTasks(user, taskFilterDto);
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
