import { Either, SuccessfulResponse } from '@shared/either';
import { AppError } from '@shared/errors';

export interface HttpRequestInterface {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
}

export interface HttpResponseInterface {
  statusCode: number;
  body: any;
}

export interface HttpParamsInterface {
  body?: string[];
  params?: string[];
  query?: string[];
  headers?: string[];
}

export interface WebControllerInterface {
  handle(request: HttpRequestInterface): Promise<Either<AppError, HttpResponseInterface>>;

  validateParams(
    request: HttpRequestInterface,
    requireParams: HttpParamsInterface,
  ): Either<AppError, SuccessfulResponse>;
}
