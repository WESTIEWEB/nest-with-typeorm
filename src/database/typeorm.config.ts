import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const migrationsDir = resolve(__dirname, 'migrations');

const migrations = [`${migrationsDir}/*{.ts,.js}`];

if (
  process.env.NODE_ENV !== 'production' ||
  process.env.DATABASE_TEST_MIGRATIONS
) {
  migrations.push(`${migrationsDir}/test/*{.ts,.js}`);
}

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: (process.env.DB_PORT as unknown as number) ?? 5432,
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'taskmanagement',
  entities: [__dirname + '/../**/*-entity.{js,ts}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  migrations,
};

export const connectionSource = new DataSource(typeOrmConfig);
// @Injectable()
// export class TypeOrmConfigService implements TypeOrmOptionsFactory {
//   @Inject(ConfigService)
//   private readonly configService: ConfigService;
//   public createTypeOrmOptions(): TypeOrmModuleOptions {
//     return {
//       type: 'postgres',
//       host: this.configService.get<string>('DB_HOST'),
//       port: this.configService.get<number>('DB_PORT'),
//       username: this.configService.get<string>('DB_USER'),
//       password: this.configService.get<string>('DB_PASSWORD'),
//       database: this.configService.get<string>('DB_NAME'),
//       entities: [__dirname + '/../**/*-entity.{js,ts}'],
//       synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE'),
//       logging: this.configService.get<boolean>('DB_LOGGING'),
//       migrations: [`${migrationsDir}/*{.ts,.js}`],
//       // migrationsRun: true,
//       // migrationsTableName: 'migrations_typeorm',
//     };
//   }
// }
