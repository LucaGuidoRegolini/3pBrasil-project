import { NextFunction, Request, Response } from 'express';
import { app_environment } from '@configs/appConfig';
import { Logger } from './logger';
import { AppError } from '@shared/errors';
import { CelebrateError, errors } from 'celebrate';

const environment = process.env.APP_ENVIRONMENT || 'DEV';
export class HttpLogger {
  static expressRequestLogger(req: Request, res: Response, next: NextFunction) {
    if (environment === app_environment.production) {
      Logger.info(`Request: ${req.method} - ${req.path} | ${req.ip} | ${req.hostname}`);
    } else {
      Logger.info(`Request: ${req.method} - ${req.path} | ${JSON.stringify(req.body)}`);
    }

    next();
  }

  static expressErrorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
    if (!(err instanceof AppError)) {
      return next(err);
    }

    if (environment === app_environment.production) {
      Logger.error(`Error: ${req.method} - ${req.path} | error ${err.message}}`);
    } else {
      Logger.error(`Error: ${req.method} - ${req.path} | error ${err}`);
    }

    return res.status(err.statusCode).json({
      status: err.statusCode,
      name: err.name,
      error: err.message,
    });
  }

  static celebrateErrorLogger(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (!(err instanceof CelebrateError)) {
      return next(err);
    }

    res.status(422).json({
      status: 422,
      name: 'ValidationError',
      error: err.details.get('body'),
    });
  }

  static serverErrorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
    if (environment === app_environment.production) {
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
