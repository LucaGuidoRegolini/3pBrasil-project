import {
  AppError,
  BadRequestError,
  InternalServerError,
  MissingRequestError,
} from '@shared/errors';
import {
  HttpParamsInterface,
  HttpRequestInterface,
  HttpResponseInterface,
  RequestProps,
  WebControllerInterface,
} from './WebControllerInterface';
import { Either, SuccessfulResponse, left, right } from '@shared/either';

interface validationResponseInterface {
  missingParams: string[];
  typeError: string[];
  validValues: string[];
}
export abstract class WebController implements WebControllerInterface {
  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    return left(new InternalServerError('Method not implemented'));
  }

  validateRequest(
    request: HttpRequestInterface,
    requireParams: HttpParamsInterface,
  ): Either<BadRequestError | MissingRequestError, SuccessfulResponse<string>> {
    const { extra_params = true } = requireParams;

    const extraParams = this.extraParams(request, requireParams, extra_params);

    if (extraParams.isLeft()) return extraParams;

    requireParams.body &&
      Object.keys(requireParams.body).forEach((param) => {
        const resp = this.validateParams(
          request,
          requireParams.body as RequestProps,
          param,
        );

        if (resp.isLeft()) return resp;
      });

    requireParams.params &&
      Object.keys(requireParams.params).forEach((param) => {
        const resp = this.validateParams(
          request,
          requireParams.params as RequestProps,
          param,
        );

        if (resp.isLeft()) return resp;
      });

    requireParams.query &&
      Object.keys(requireParams.query).forEach((param) => {
        const resp = this.validateParams(
          request,
          requireParams.query as RequestProps,
          param,
        );

        if (resp.isLeft()) return resp;
      });

    requireParams.headers &&
      Object.keys(requireParams.headers).forEach((param) => {
        const resp = this.validateParams(
          request,
          requireParams.headers as RequestProps,
          param,
        );

        if (resp.isLeft()) return resp;
      });

    return right(new SuccessfulResponse('Params validated'));
  }

  private extraParams(
    request: HttpRequestInterface,
    requireParams: HttpParamsInterface,
    extra_params: boolean,
  ): Either<BadRequestError, SuccessfulResponse<string>> {
    if (extra_params) return right(new SuccessfulResponse('Extra params allowed'));

    const bodyExtraParams =
      request.body && requireParams.body
        ? Object.keys(request.body).filter(
            (param) => !Object.keys(requireParams.body as RequestProps).includes(param),
          )
        : [];

    const paramsExtraParams =
      request.params && requireParams.params
        ? Object.keys(request.params).filter(
            (param) => !Object.keys(requireParams.params as RequestProps).includes(param),
          )
        : [];

    const queryExtraParams =
      request.query && requireParams.query
        ? Object.keys(request.query).filter(
            (param) => !Object.keys(requireParams.query as RequestProps).includes(param),
          )
        : [];

    let errorMessage = '';

    if (bodyExtraParams.length > 0)
      errorMessage += `Extra params in body: ${bodyExtraParams.join(', ')} \n`;
    if (paramsExtraParams.length > 0)
      errorMessage += `Extra params in params: ${paramsExtraParams.join(', ')} \n`;
    if (queryExtraParams.length > 0)
      errorMessage += `Extra params in query: ${queryExtraParams.join(', ')} \n`;

    if (errorMessage === '') return right(new SuccessfulResponse('Extra params allowed'));

    console.log(errorMessage);

    return left(new BadRequestError(errorMessage));
  }

  private validateParams(
    request: HttpRequestInterface,
    requestValidation: RequestProps,
    param: string,
  ): Either<BadRequestError | MissingRequestError, SuccessfulResponse<string>> {
    const { required = true, type, valid, label } = requestValidation?.[param];

    const paramName = label || param;

    if (requestValidation?.[param].default) {
      if (!Object.keys(request.body).includes(param)) {
        request.body[param] = requestValidation?.[param].default;
      }
    }

    if (required) {
      if (!Object.keys(request.body).includes(param)) {
        left(
          new MissingRequestError(`Missing param ${paramName}, ${paramName} is required`),
        );
      }
    }

    if (type) {
      if (typeof request.body[param] !== requestValidation?.[param].type) {
        left(
          new BadRequestError(
            `Invalid type for ${paramName}, ${paramName} must be ${type}`,
          ),
        );
      }
    }

    if (valid) {
      if (!requestValidation?.[param].valid?.includes(request.body[param])) {
        left(
          new BadRequestError(
            `Invalid value for ${paramName}, ${paramName} must be ${valid.join(', ')}`,
          ),
        );
      }
    }

    return right(new SuccessfulResponse('Params validated'));
  }

  public validation(): HttpParamsInterface {
    return {
      body: {},
      params: {},
      query: {},
      headers: {},
    };
  }
}
