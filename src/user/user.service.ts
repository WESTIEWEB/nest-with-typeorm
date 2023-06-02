import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/create_user.dto';
import { UserPersistedEntity } from './entities/user.persisted-entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
  /**
   * Register a user
   * @param registerDto - DTO of user to be created
   * @returns - The registered User
   */
  async signUp(registerDto: CreateUserDto): Promise<UserPersistedEntity> {
    return await this.userRepository.createUser(registerDto);
  }
}
