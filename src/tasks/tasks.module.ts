import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './repository/task.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    PassportModule,
    JwtModule.register({
      secret: 'shok@7kilAhsha',
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
  exports: [TasksService, TaskRepository],
})
export class TasksModule {}
