import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPersistedEntity } from './entities/user.persisted-entity';
import { AuthGuard, GetUser } from 'src/auth';
import { AuthPayload } from 'src/auth/constant';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/v1/user')
  async createTask(
    @GetUser()
    user: AuthPayload,
  ): Promise<UserPersistedEntity> {
    return await this.userService.getUserById(user.sub);
  }
}
