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
import { AuthGuard } from './auth-guard';

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
  async login(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return await this.authService.login(authCredentialsDto);
  }

  @Post('usr-rq')
  @UseGuards(AuthGuard)
  async userRequest(@Req() req: Request) {
    console.log(req['user']);
  }
}
