import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      //   migrations: [],
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}
