import { HttpResponseInterface } from './WebControllerInterface';

export class HttpResponse {
  static ok(data: any): HttpResponseInterface {
    return {
      statusCode: 200,
      body: data,
    };
  }

  static noResponse(data: any): HttpResponseInterface {
    return {
      statusCode: 204,
      body: data,
    };
  }

  static created(data: any): HttpResponseInterface {
    return {
      statusCode: 201,
      body: data,
    };
  }

  static badRequest(data: any): HttpResponseInterface {
    return {
      statusCode: 400,
      body: data,
    };
  }

  static unauthorized(data: any): HttpResponseInterface {
    return {
      statusCode: 401,
      body: data,
    };
  }
}
