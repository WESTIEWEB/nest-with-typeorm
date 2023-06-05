import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/repository/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './constant';

@Injectable()
export class AuthService {
  constructor(
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

    const accessToken = await this.generateSignature({
      email: user.email,
      sub: user.id,
    });

    return {
      status: `success`,
      signature: accessToken,
    };
  }

  async login(authCredentalsDto: AuthCredentialsDto) {
    const user = await this.userRepository.login(authCredentalsDto);

    const payload: AuthPayload = {
      email: user.email,
      sub: user.id,
    };
    const accessToken = await this.generateSignature(payload);

    return { status: `success`, signature: accessToken };
  }

  async generateSignature(payload: AuthPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
