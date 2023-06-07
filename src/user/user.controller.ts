import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPersistedEntity } from './entities/user.persisted-entity';
import { AuthGuard, GetUser } from 'src/auth';
import { AuthPayload } from 'src/auth/constant';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/v1/user')
  @UseGuards(AuthGuard)
  async createTask(
    @GetUser()
    user: AuthPayload,
  ): Promise<UserPersistedEntity> {
    return await this.userService.getUserById(user.sub);
  }

  @Post('api/v1/email-verify')
  async verifyEmail(@Body() email: string, otp: number) {
    await this.userService.verifyEmail(email, otp);
  }
}
