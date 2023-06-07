import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/repository/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './constant';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserPersistedEntity } from 'src/user/entities/user.persisted-entity';
import { UserStatus } from 'src/common';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a user
   * @param registerDto - DTO of user to be created
   * @returns - The registered User
   */
  async signUp(registerDto: AuthCredentialsDto) {
    const user = await this.userRepository.createUser(registerDto);

    // const accessToken = await this.generateSignature({
    //   email: user.email,
    //   sub: user.id,
    // });

    return {
      status: `success`,
      emailOtp: user.otp,
    };
  }

  // async login(authCredentalsDto: AuthCredentialsDto) {
  //   const user = await this.userRepository.login(authCredentalsDto);

  //   const payload: AuthPayload = {
  //     email: user.email,
  //     sub: user.id,
  //   };
  //   const accessToken = await this.generateSignature(payload);

  //   return { status: `success`, signature: accessToken };
  // }

  async generateSignature(payload: AuthPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async validateUser(emial: string, password: string) {
    const user = await this.userRepository.getUserByEmail(emial, false);

    if (!user) throw new UnauthorizedException(`Invalid email or password`);

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!(isPasswordValid === true))
      throw new UnauthorizedException(`Invalid email or password`);

    if (!user.isVerified)
      throw new UnauthorizedException(`Please verify your email to continue`);
    if (
      user.status === UserStatus.BLOCKED ||
      user.status === UserStatus.DEACTIVATED ||
      user.status === UserStatus.DELETED
    )
      throw new UnauthorizedException(
        `User is ${user.status.toLocaleLowerCase()}`,
      );

    return user;
  }

  login(user: UserPersistedEntity) {
    const payload: AuthPayload = {
      email: user.email,
      sub: user.id,
      id: user.id,
    };
    const token = this.generateSignature(payload);
    const expiry = new Date();

    expiry.setSeconds(
      expiry.getSeconds() + this.config.get<number>(`jwt.expiresIn`),
    );

    return { status: `success`, token, expiry, ...payload };
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);
    console.log(result);
    return result;
  }
}
