import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AppLoggerModule } from './logging';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    AuthModule,
    TasksModule,
    UserModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AppLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'debug',
      },
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
