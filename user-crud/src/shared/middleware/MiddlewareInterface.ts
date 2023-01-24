import { Either, SuccessfulResponse } from '@shared/either';
import { AppError } from '@shared/errors';
import { HttpRequestInterface } from '@shared/http/WebControllerInterface';

export interface ExtraRequestInterface {
  [key: string]: any;
}

export interface MiddlewareInterface {
  handler(
    req: HttpRequestInterface,
    param?: any,
  ): Promise<Either<AppError, ExtraRequestInterface | SuccessfulResponse<boolean>>>;
}
