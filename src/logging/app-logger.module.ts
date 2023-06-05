import { DynamicModule } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { LoggerModule, LoggerModuleAsyncParams, Params } from 'nestjs-pino';
import { AppLogger, NestAppLogger } from './logger';

export class AppLoggerModule extends LoggerModule {
  private static normalizeParams(params: Params = {}): Params {
    return {
      ...params,
      pinoHttp: {
        ...(params.pinoHttp ?? {}),
        customLogLevel: (_req: IncomingMessage, res: ServerResponse) => {
          if (res.statusCode >= 400 && res.statusCode <= 499) {
            return 'warn';
          }

          if (res.statusCode >= 500) {
            return 'error';
          }

          return 'info';
        },
      },
      exclude: [],
    };
  }

  public static forRoot(params: Params = {}): DynamicModule {
    const result = LoggerModule.forRoot(
      AppLoggerModule.normalizeParams(params),
    );
    return {
      ...result,
      providers: [...(result.providers ?? []), AppLogger, NestAppLogger],
    };
  }

  public static forRootAsync(params: LoggerModuleAsyncParams): DynamicModule {
    const result = LoggerModule.forRootAsync({
      ...params,
      useFactory: async (...args: any[]) => {
        const plainParams = await params.useFactory(...args);
        return AppLoggerModule.normalizeParams(plainParams);
      },
    });

    return {
      ...result,
      providers: [...(result.providers ?? []), AppLogger, NestAppLogger],
    };
  }
}
