import { WebController } from '@shared/http/WebController';
import { CreateUserService } from '../services/CreateUserService';
import {
  HttpParamsInterface,
  HttpRequestInterface,
  HttpResponseInterface,
} from '@shared/http/WebControllerInterface';
import { Either, left, right } from '@shared/either';
import { AppError } from '@shared/errors';
import { HttpResponse } from '@shared/http/httpResponse';
import { userTypes } from '@configs/user';

export class CreateUserController extends WebController {
  private createUserService: CreateUserService;

  constructor(createUserService: CreateUserService) {
    super();
    this.createUserService = createUserService;
  }

  public async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const validation = this.validateRequest(request, this.validation());

    if (validation.isLeft()) return left(validation.value);

    const { name, email, password, cpf, phone, type } = request.body;

    const resp = await this.createUserService.execute({
      name,
      email,
      password,
      cpf,
      phone,
      type,
    });

    if (resp.isLeft()) {
      return left(resp.value);
    }

    return right(HttpResponse.created(resp.value));
  }

  private validation(): HttpParamsInterface {
    return {
      extra_params: false,
      body: {
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
        },

        password: {
          type: 'string',
        },

        cpf: {
          type: 'string',
        },

        phone: {
          type: 'string',
        },

        type: {
          type: 'string',

          valid: Object.values(userTypes),
        },
      },
    };
  }
}
