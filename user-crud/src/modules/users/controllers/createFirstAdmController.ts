import { Either, left, right } from '@shared/either';
import { AppError } from '@shared/errors';
import { WebController } from '@shared/http/WebController';
import {
  HttpParamsInterface,
  HttpRequestInterface,
  HttpResponseInterface,
} from '@shared/http/WebControllerInterface';
import { HttpResponse } from '@shared/http/httpResponse';
import { CreateFirstAdmService } from '../services/CreateFirstAdmService';
import { userTypes } from '@configs/user';

export class CreateFirstAdmController extends WebController {
  private createFirstAdmService: CreateFirstAdmService;

  constructor(createFirstAdmService: CreateFirstAdmService) {
    super();
    this.createFirstAdmService = createFirstAdmService;
  }

  public async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { name, email, password, cpf, phone } = request.body;

    const resp = await this.createFirstAdmService.execute({
      name,
      email,
      password,
      cpf,
      phone,
    });

    if (resp.isLeft()) {
      return left(resp.value);
    }

    return right(HttpResponse.created(resp.value));
  }

  public validation(): HttpParamsInterface {
    return {
      extra_params: false,
      body: {
        name: {
          type: 'string',
          required: true,
        },
        email: {
          type: 'string',
          required: true,
        },

        password: {
          type: 'string',
          required: true,
        },

        cpf: {
          type: 'string',
          required: true,
        },

        phone: {
          type: 'string',
          required: true,
        },
        type: {
          type: 'string',
          required: true,
          valid: Object.values(userTypes),
        },
      },
    };
  }
}
