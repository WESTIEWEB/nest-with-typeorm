import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUser, LocalAuthGuard } from './guard';
import { Request } from 'express';
import { UserPersistedEntity } from 'src/user/entities/user.persisted-entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('api/v1/register')
  @UsePipes(ValidationPipe)
  async signUp(
    @Body()
    createUserDto: AuthCredentialsDto,
  ) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('api/v1/login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request) {
    return this.authService.login(req.body);
  }

  @Post('usr-rq')
  @UseGuards(AuthGuard())
  async userRequest(@GetUser() user: UserPersistedEntity) {
    console.log(user);
  }
}
