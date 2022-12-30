import { NextFunction, Request, Response } from 'express';
import { app_environment } from '@configs/appConfig';
import { Logger } from './logger';
import { AppError } from '@shared/errors';

export class HttpLogger {
  private static environment = process.env.APP_ENVIRONMENT || 'DEV';

  static expressRequestLogger(req: Request, res: Response, next: NextFunction) {
    console.log(this.environment);
    if (this.environment === app_environment.production) {
      Logger.info(`Request: ${req.method} - ${req.path} | ${req.ip} | ${req.hostname}`);
    } else {
      Logger.info(`Request: ${req.method} - ${req.path} | ${JSON.stringify(req.body)}`);
    }

    next();
  }

  static expressErrorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
    if (!(err instanceof AppError)) {
      return next();
    }

    if (this.environment === app_environment.production) {
      Logger.error(`Error: ${req.method} - ${req.path} | error ${err.message}}`);
    } else {
      Logger.error(`Error: ${req.method} - ${req.path} | error ${err}`);
    }

    res.status(err.statusCode).json({
      status: err.statusCode,
      name: err.name,
      error: err.message,
    });
  }

  static serverErrorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
    if (this.environment === app_environment.production) {
      Logger.error(`Error: ${req.method} - ${req.path} | error ${err.message}}`);
    } else {
      Logger.error(`Error: ${req.method} - ${req.path} | error ${err}`);
    }

    res.status(500).json({
      status: 500,
      name: 'InternalServerError',
      error: 'Internal Server Error',
    });
  }
}
