import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { Task } from '../model/tasks.model';
import { CreateTaskDto } from '../dto/create_task.dto';
import { GetTaskFilterDto, UpdateTaskDto } from '../dto';

@Controller('tasks/api/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
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
  createTask(
    @Body()
    params: Task,
  ): Promise<CreateTaskDto> {
    console.log(params);
    return this.tasksService.createTask(params);
  }

  @Put('/:id')
  updateTask(
    @Body() params: UpdateTaskDto,
    @Param('id') id: string,
  ): Promise<Task> {
    return this.tasksService.updateTask(params, id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
