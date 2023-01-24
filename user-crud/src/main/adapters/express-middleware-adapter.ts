import { SuccessfulResponse } from '@shared/either';
import { MiddlewareInterface } from '@shared/middleware/MiddlewareInterface';
import { NextFunction, Request, Response } from 'express';

export const adapterMiddleware = (middleware: MiddlewareInterface, param?: any) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest = {
      body: request.body,
      params: request.params,
      query: request.query,
      headers: request.headers,
      user: request.user,
    };

    const httpResponse = await middleware.handler(httpRequest, param);

    if (httpResponse.isLeft()) {
      throw httpResponse.value;
    }

    const resp = httpResponse.map((value) => {
      return value;
    });

    if (!(resp instanceof SuccessfulResponse)) {
      Object.assign(request, resp);
    }

    next();
  };
};
