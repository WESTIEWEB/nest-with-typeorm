/* eslint-disable max-classes-per-file */
import { InjectPinoLogger, Logger, PinoLogger } from 'nestjs-pino';

export const InjectLogger = InjectPinoLogger;

export class AppLogger extends PinoLogger {}

export class NestAppLogger extends Logger {}
