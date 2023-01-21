import { Either, left, right } from '@shared/either';
import { AppError } from '@shared/errors';
import { WebController } from '@shared/http/WebController';
import {
  HttpParamsInterface,
  HttpRequestInterface,
  HttpResponseInterface,
} from '@shared/http/WebControllerInterface';
import { HttpResponse } from '@shared/http/httpResponse';
import { ListUserService } from '../services/ListUserService';

export class ListUserController extends WebController {
  private listUserService: ListUserService;

  constructor(listUserService: ListUserService) {
    super();
    this.listUserService = listUserService;
  }

  public async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const validation = this.validateRequest(request, this.validation());

    if (validation.isLeft()) return left(validation.value);

    const { page, limit, email, name } = request.query;

    const resp = await this.listUserService.execute({
      page,
      limit,
      email,
      name,
    });

    if (resp.isLeft()) {
      return left(resp.value);
    }

    return right(HttpResponse.ok(resp.value));
  }

  private validation(): HttpParamsInterface {
    return {
      extra_params: false,
      query: {
        page: {
          type: 'number',
          required: false,
        },
        limit: {
          type: 'number',
          required: false,
        },
        email: {
          type: 'string',
          required: false,
        },
        name: {
          type: 'string',
          required: false,
        },
      },
    };
  }
}
