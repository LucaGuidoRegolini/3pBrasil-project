import { AppError, InternalServerError, MissingRequestError } from '@shared/errors';
import {
  HttpParamsInterface,
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from './WebControllerInterface';
import { Either, SuccessfulResponse, left, right } from '@shared/either';

export abstract class WebController implements WebControllerInterface {
  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    return left(new InternalServerError('Method not implemented'));
  }
  validateParams(
    request: HttpRequestInterface,
    requireParams: HttpParamsInterface,
  ): Either<AppError, SuccessfulResponse> {
    const missingParams: string[] = [];

    requireParams.body?.forEach((param) => {
      if (!Object.keys(request.body).includes(param)) {
        missingParams.push(param);
      }
    });

    requireParams.params?.forEach((param) => {
      if (!Object.keys(request.params).includes(param)) {
        missingParams.push(param);
      }
    });

    requireParams.query?.forEach((param) => {
      if (!Object.keys(request.query).includes(param)) {
        missingParams.push(param);
      }
    });

    requireParams.headers?.forEach((param) => {
      if (!Object.keys(request.headers).includes(param)) {
        missingParams.push(param);
      }
    });

    if (missingParams.length > 0) {
      return left(new MissingRequestError(`Missing params: ${missingParams}`));
    }

    return right(new SuccessfulResponse('Params validated'));
  }
}
