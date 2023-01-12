import { Request, Response } from 'express';
import {
  HttpResponseInterface,
  WebControllerInterface,
} from '@shared/http/WebControllerInterface';

export const adaptRoute = (controller: WebControllerInterface) => {
  return async (request: Request, response: Response) => {
    const httpRequest = {
      body: request.body,
      params: request.params,
      query: request.query,
      headers: request.headers,
    };

    const httpResponse = await controller.handle(httpRequest);

    if (httpResponse.isLeft()) {
      throw httpResponse.value;
    }

    const resp = httpResponse.value as HttpResponseInterface;

    response.status(resp.statusCode).json(resp.body);
  };
};
