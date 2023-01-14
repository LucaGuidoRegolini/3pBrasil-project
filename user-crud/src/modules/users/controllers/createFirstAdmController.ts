import { Either, left, right } from '@shared/either';
import { AppError } from '@shared/errors';
import { WebController } from '@shared/http/WebController';
import {
  HttpRequestInterface,
  HttpResponseInterface,
} from '@shared/http/WebControllerInterface';
import { HttpResponse } from '@shared/http/httpResponse';
import { CreateFirstAdmService } from '../services/CreateFirstAdmService';

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

    const validation = this.validateParams(request, {
      body: ['name', 'email', 'password', 'cpf', 'phone'],
    });

    if (validation.isLeft()) return left(validation.value);

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
}
