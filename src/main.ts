import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestAppLogger } from './logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(NestAppLogger);
  const config: ConfigService = app.get(ConfigService);
  const port = config.get<number>('PORT');

  app.useLogger(logger);

  // Let's clean up when the app is terminating
  app.enableShutdownHooks();

  await app.listen(port);
}
bootstrap();
