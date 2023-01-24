import { options } from '@configs/winston';
import winston from 'winston';

export class Logger {
  static logger: winston.Logger;

  public static init(): void {
    this.logger = winston.createLogger({
      format: winston.format.json(),
      defaultMeta: { service: 'authentication-service' },
      transports: [
        new winston.transports.File(options.error),
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console),
      ],
    });
  }

  public static info(message: string): void {
    this.logger.info(message);
  }

  public static error(message: string): void {
    this.logger.error(message);
  }

  public static throwError(message: any): void {
    this.logger.error(message);
  }
}
