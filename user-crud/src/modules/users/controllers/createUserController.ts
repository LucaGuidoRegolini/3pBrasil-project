import { WebController } from '@shared/http/WebController';
import { CreateUserService } from '../services/CreateUserService';
import {
  HttpRequestInterface,
  HttpResponseInterface,
} from '@shared/http/WebControllerInterface';
import { Either, left, right } from '@shared/either';
import { AppError } from '@shared/errors';
import { HttpResponse } from '@shared/http/httpResponse';

export class CreateUserController extends WebController {
  private createUserService: CreateUserService;

  constructor(createUserService: CreateUserService) {
    super();
    this.createUserService = createUserService;
  }

  public async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { name, email, password, cpf, phone, type } = request.body;

    const validation = this.validateParams(request, {
      body: ['name', 'email', 'password', 'cpf', 'phone', 'type'],
    });

    if (validation.isLeft()) return left(validation.value);

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
}
