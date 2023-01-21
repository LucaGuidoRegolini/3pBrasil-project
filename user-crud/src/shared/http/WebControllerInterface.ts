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

type ParamType = 'string' | 'number' | 'boolean';
export interface ParamProps {
  required?: boolean;
  type?: ParamType;
  default?: any;
  valid?: any[];
  label?: string;
}

export interface RequestProps {
  [key: string]: ParamProps;
}

export interface HttpParamsInterface {
  extra_params?: boolean;
  body?: RequestProps;
  params?: RequestProps;
  query?: RequestProps;
  headers?: RequestProps;
}

export interface WebControllerInterface {
  handle(request: HttpRequestInterface): Promise<Either<AppError, HttpResponseInterface>>;

  validateRequest(
    request: HttpRequestInterface,
    requireParams: HttpParamsInterface,
  ): Either<AppError, SuccessfulResponse<string>>;
}
