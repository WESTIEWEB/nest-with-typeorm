import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UserPersistedEntity } from './entities/user.persisted-entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('api/v1/register')
  @UsePipes(ValidationPipe)
  async signUp(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<UserPersistedEntity> {
    return await this.userService.signUp(createUserDto);
  }
}
