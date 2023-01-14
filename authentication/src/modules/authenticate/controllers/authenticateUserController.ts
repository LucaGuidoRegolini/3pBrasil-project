import { AuthenticationService } from '../services/AuthenticateUserService';
import {
  HttpRequestInterface,
  HttpResponseInterface,
} from '@shared/http/WebControllerInterface';
import { WebController } from '@shared/http/WebController';
import { Either, left, right } from '@shared/either';
import { AppError } from '@shared/errors';
import { HttpResponse } from '@shared/http/httpResponse';

export class AuthenticateUserController extends WebController {
  private authenticationService: AuthenticationService;

  constructor(authenticationService: AuthenticationService) {
    super();
    this.authenticationService = authenticationService;
  }

  public async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const validation = this.validateParams(request, {
      body: ['email', 'password'],
    });

    if (validation.isLeft()) return left(validation.value);

    const { email, password } = request.body;

    const resp = await this.authenticationService.execute({ email, password });

    if (resp.isLeft()) {
      return left(resp.value);
    }

    return right(HttpResponse.ok(resp.value));
  }
}
