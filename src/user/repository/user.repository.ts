import { DataSource, Repository } from 'typeorm';
import { UserPersistedEntity } from '../entities/user.persisted-entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create_user.dto';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

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

    //generate salt
    const salt = await bcrypt.genSalt();
    // hash password
    const hashedPassword = await this.hashPassword(password, salt);
    const user = this.create({
      id: uuid(),
      email,
      password: hashedPassword,
      salt,
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
      throw new ConflictException(
        `Email credential already exist, please login`,
      );
    }
  }

  /**
   * hash password
   * @param password - password to be hashed
   * @param salt - salt to be used for hashing
   * @returns - hashed password
   */
  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  /**
   * login user
   * @param createUserDto - DTO for user login
   * @return user
   */
  async login(authCredentials: CreateUserDto): Promise<UserPersistedEntity> {
    const { email, password } = authCredentials;
    const user = await this.findOne({ where: { email } });

    if (!(user && (await user.validatePassword(password))))
      throw new UnauthorizedException(`Invalid credentials`);

    return user;
  }

  /**
   * get user by id
   * @param id - id of the user to be fetched
   * @return user
   */
  async getUserById(id: string): Promise<UserPersistedEntity> {
    const user = await this.findOne({ where: { id }, relations: ['tasks'] });

    this.deleteSensitiveData(user);
    return user;
  }

  /**
   * delete sensitive data
   * @param user - user to be modified
   * @return user
   * @private
   */
  private deleteSensitiveData(user: UserPersistedEntity): void {
    delete user.password;
    delete user.salt;

    user.tasks.forEach((task) => {
      delete task.userId;
    });
  }
}
