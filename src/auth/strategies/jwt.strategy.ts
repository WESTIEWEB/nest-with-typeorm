import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/user/repository/user.repository';
import { AuthPayload } from '../constant';
import { UnauthorizedException } from '@nestjs/common';
import { UserPersistedEntity } from 'src/user/entities/user.persisted-entity';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: AuthPayload): Promise<UserPersistedEntity> {
    const { email } = payload;

    const isUser = await this.userRepository.getUserByEmail(email);

    if (!isUser) {
      throw new UnauthorizedException(`Invalid email or password`);
    }

    return isUser;
  }
}
