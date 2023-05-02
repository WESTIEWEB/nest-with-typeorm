/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolve } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const migrationsDir = resolve(__dirname, 'migrations');

const migrations = [`${migrationsDir}/*{.ts,.js}`];

if (process.env.NODE_ENV !== 'production' || process.env.DATABASE_TEST_MIGRATIONS) {
  migrations.push(`${migrationsDir}/test/*{.ts,.js}`);
}

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT as unknown as number ?? 5432,
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'taskmanagement',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  logging: process.env.DB_LOGGING === 'true',
  migrations,
};
