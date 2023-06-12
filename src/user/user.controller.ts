import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserPersistedEntity } from './entities/user.persisted-entity';
import { AuthGuard, GetUser } from 'src/auth';
import { AuthPayload } from 'src/auth/constant';
import { VerifyEmailDto } from './dto';

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
  async verifyEmail(@Body(ValidationPipe) body: VerifyEmailDto) {
    await this.userService.verifyEmail(body);
  }

  @Post('api/v1/email/resend-otp')
  async resendOtp(@Body() body: { email: string }) {
    return await this.userService.resendOtp(body.email);
  }
}
