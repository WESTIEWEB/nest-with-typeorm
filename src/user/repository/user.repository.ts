import { DataSource, Repository } from 'typeorm';
import { UserPersistedEntity } from '../entities/user.persisted-entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create_user.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserRepository extends Repository<UserPersistedEntity> {
  constructor(private dataSource: DataSource) {
    super(UserPersistedEntity, dataSource.createEntityManager());
  }
  /**
   * Register User
   * @param createUserDto - DTO of the user to be created
   * @return - The  created User
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserPersistedEntity> {
    const { email, password } = createUserDto;
    await this.verifyEmail(email);

    const user = this.create({
      id: uuid(),
      email,
      password,
    } as UserPersistedEntity);

    await user.save();

    return user;
  }

  /**
   * Check if user already exist
   * @param Email - Email of the user to be verified
   * @throws BadRequestException if user already exist
   */
  async verifyEmail(email: string): Promise<void> {
    const user = await this.findOne({
      where: { email },
    });

    if (user) {
      throw new ConflictException(`User with the Email already exist`);
    }
  }
}
