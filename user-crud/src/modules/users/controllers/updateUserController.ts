import { Either, left, right } from '@shared/either';
import { AppError } from '@shared/errors';
import { WebController } from '@shared/http/WebController';
import {
  HttpParamsInterface,
  HttpRequestInterface,
  HttpResponseInterface,
} from '@shared/http/WebControllerInterface';
import { HttpResponse } from '@shared/http/httpResponse';
import { UpdateUserService } from '../services/UpdateUserService';

export class UpdateUserController extends WebController {
  private updateUserService: UpdateUserService;

  constructor(updateUserService: UpdateUserService) {
    super();
    this.updateUserService = updateUserService;
  }

  public async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { id } = request.params;
    const { name, email, cpf, phone } = request.body;

    const resp = await this.updateUserService.execute({
      user_id: id,
      name,
      email,
      cpf,
      phone,
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
        },
      },
      body: {
        name: {
          type: 'string',
          required: false,
        },
        email: {
          type: 'string',
          required: false,
        },

        cpf: {
          type: 'string',
          required: false,
        },

        phone: {
          type: 'string',
          required: false,
        },
      },
    };
  }
}
