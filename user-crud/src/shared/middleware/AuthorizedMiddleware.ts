import { Either, SuccessfulResponse, left, right } from '@shared/either';
import { UnauthorizedError } from '@shared/errors';
import { HttpRequestInterface } from '@shared/http/WebControllerInterface';

import { userTypes, user_valid_types } from '@configs/user';
import { MiddlewareInterface } from './MiddlewareInterface';

export class AuthorizationMiddleware implements MiddlewareInterface {
  private static instance: AuthorizationMiddleware;

  private constructor() {}

  public static build(): AuthorizationMiddleware {
    if (!AuthorizationMiddleware.instance) {
      AuthorizationMiddleware.instance = new AuthorizationMiddleware();
    }
    return AuthorizationMiddleware.instance;
  }

  async handler(
    req: HttpRequestInterface,
    param: user_valid_types,
  ): Promise<Either<UnauthorizedError, SuccessfulResponse<boolean>>> {
    const { user, params } = req;

    if (!user) return left(new UnauthorizedError('Missing authorization header'));

    if (!params) return left(new UnauthorizedError('Missing id params'));

    if (!params[param]) return left(new UnauthorizedError('Missing id params'));

    if (user.id !== params[param] && user.type !== userTypes.ADMIN)
      return left(new UnauthorizedError('User not authorized'));

    return right(new SuccessfulResponse(true));
  }
}

export const authorizationMiddleware = AuthorizationMiddleware.build();
