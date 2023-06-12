import { DataSource, Repository } from 'typeorm';
import { UserPersistedEntity } from '../entities/user.persisted-entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create_user.dto';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { DateTime } from 'luxon';
import {
  generateOtpExpiry,
  generateRandomNumber,
  generateRandomNumbers,
} from '../utils/util';
import { UserStatus } from 'src/common';
import { VerifyEmailDto } from '../dto';

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
    await this.checkIfUserExist(email);

    //generate salt
    const salt = await bcrypt.genSalt();
    // hash password
    const hashedPassword = await this.hashPassword(password, salt);
    const user = this.create({
      id: uuid(),
      email,
      otp: generateRandomNumbers(6),
      otpExpiry: generateOtpExpiry(),
      password: hashedPassword,
      salt,
    } as UserPersistedEntity);

    await user.save();

    // TODO - send email to user

    // this.deleteSensitiveData(user, false);
    return user;
  }

  /**
   * Check if user already exist
   * @param Email - Email of the user to be verified
   * @throws BadRequestException if user already exist
   */
  async checkIfUserExist(email: string): Promise<void> {
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
   * verify user
   * @param verifyEmailDto: DTO for the user email verification
   * @description - verify user using otp
   * @description - update user status to verified
   */
  async verifyUser(verifyEmailDto: VerifyEmailDto): Promise<void> {
    const { email, otp } = verifyEmailDto;
    console.log(email, otp);
    const user = await this.getUserByEmail(email, false);

    console.log(user.otp);

    if (user.isVerified) throw new ConflictException(`User already verified`);

    if (user.otp !== otp) throw new UnauthorizedException(`Invalid OTP`);

    if (DateTime.now() > user.otpExpiry)
      throw new UnauthorizedException(`OTP expired`);

    await this.update(
      {
        email: user.email,
      },
      {
        isVerified: true,
        status: UserStatus.ACTIVE,
        otp: null,
        otpExpiry: null,
      },
    );
  }

  /**
   * Resend Otp
   * @param email - Email of the user requesting otp
   */
  async resendOtp(email: string): Promise<Record<string, any>> {
    // check if email exist
    console.log(email);
    await this.getUserByEmail(email);

    await this.update(
      {
        email,
      },
      {
        otp: generateRandomNumbers(6),
        otpExpiry: generateOtpExpiry(),
      },
    );

    const user = await this.findOne({ where: { email } });

    const currentTime = DateTime.now();
    const otpExpiryTime = DateTime.fromJSDate(user.otpExpiry);
    const timeDiff = otpExpiryTime.diff(currentTime, 'minutes').minutes;
    // const expirtTime = timeDiff.as('minutes');

    // Todo: Send mail

    return {
      otp: user.otp,
      expires: `in ${Math.ceil(timeDiff)} minutes`,
    };
  }

  /**
   * get user by id
   * @param id - id of the user to be fetched
   * @return user
   */
  async getUserById(id: string): Promise<UserPersistedEntity> {
    const user = await this.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User not found, please register`);

    this.deleteSensitiveData(user, true);
    return user;
  }

  /**
   * get user by email
   * @param email - email of the user to be fetched
   * @return user
   */
  async getUserByEmail(
    email: string,
    deleteSensitive = true,
  ): Promise<UserPersistedEntity> {
    const user = await this.findOne({ where: { email } });
    if (!user) throw new NotFoundException(`User not found, please register`);

    this.deleteSensitiveData(user, deleteSensitive);
    return user;
  }

  /**
   * delete sensitive data
   * @param user - user to be modified
   * @return user
   * @private
   */
  private deleteSensitiveData(
    user: UserPersistedEntity,
    includeSensitive: boolean,
  ): void {
    if (includeSensitive) {
      delete user.password;
      delete user.salt;
      delete user.otp;
      delete user.otpExpiry;
      delete user.password;
      delete user.tasks;

      user?.tasks?.forEach((task) => {
        delete task.user;
      });
    }

    return;
  }
}
