import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UserPersistedEntity } from './entities/user.persisted-entity';
import { TaskPersistedEntity } from 'src/tasks/entity';
import { UserTaskDto } from './dto';
import { AuthGuard } from 'src/auth';
import { Request } from 'express';

@Controller('user')
export class TaskController {
  constructor(private userService: UserService) {}
}
