import { user_valid_types } from '@configs/user';
import { Either, SuccessfulResponse } from '@shared/either';
import { AppError } from '@shared/errors';

export interface HttpRequestInterface {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
  user?: {
    id: string;
    email: string;
    type: user_valid_types;
  };
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

  /**
   * @param request  Request object
   * @param requireParams  Object with the required params
   * @param extra_params  Boolean to allow extra params
   */
  validateRequest(
    request: HttpRequestInterface,
    requireParams: HttpParamsInterface,
  ): Either<AppError, SuccessfulResponse<string>>;

  validation(): HttpParamsInterface;
}
