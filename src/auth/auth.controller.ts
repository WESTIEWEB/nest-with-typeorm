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
import { AuthGuard } from './guard/auth-guard';
import { LocalAuthGuard } from './guard';
import { Request } from 'express';

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
  @UseGuards(AuthGuard)
  async userRequest(@Req() req: Request) {
    console.log(req['user']);
  }
}
