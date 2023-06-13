import { resolve } from 'path';
import * as dotenv from 'dotenv';
import * as config from 'config';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const dbConfigService = config.get('db');

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
  host: process.env.DB_HOST ?? dbConfigService.host,
  port: (process.env.DB_PORT as unknown as number) ?? dbConfigService.port,
  username: process.env.DB_USER ?? dbConfigService.username,
  password: process.env.DB_PASSWORD ?? dbConfigService.password,
  database: process.env.DB_NAME ?? dbConfigService.database,
  entities: [__dirname + '/../**/*-entity.{js,ts}'],
  synchronize: process.env.DB_SYNCHRONIZE || dbConfigService.synchronize,
  logging: process.env.DB_LOGGING === 'true',
  migrations,
};

export const connectionSource = new DataSource(typeOrmConfig);
