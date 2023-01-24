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
import { GetUserService } from '../services/GetUserService';

export class GetUserController extends WebController {
  private getUserService: GetUserService;

  constructor(getUserService: GetUserService) {
    super();
    this.getUserService = getUserService;
  }

  public async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { id } = request.params;

    const resp = await this.getUserService.execute({
      user_id: id,
    });

    if (resp.isLeft()) {
      return left(resp.value);
    }

    return right(HttpResponse.ok(resp.value));
  }

  public validation(): HttpParamsInterface {
    return {
      extra_params: false,
      params: {
        id: {
          type: 'string',
          required: true,
        },
      },
    };
  }
}
