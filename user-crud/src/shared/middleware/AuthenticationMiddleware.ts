import { Either, left, right } from '@shared/either';
import { UnauthorizedError } from '@shared/errors';
import { HttpRequestInterface } from '@shared/http/WebControllerInterface';
import { ExtraRequestInterface, MiddlewareInterface } from './MiddlewareInterface';
import { authConfig, tokenPropsInterface } from '@configs/auth';
import { HashGeneration } from '@shared/hashGeneration.ts/hashGenaration';

export class AuthenticationMiddleware implements MiddlewareInterface {
  private static instance: AuthenticationMiddleware;

  private constructor() {}

  public static build(): AuthenticationMiddleware {
    if (!AuthenticationMiddleware.instance) {
      AuthenticationMiddleware.instance = new AuthenticationMiddleware();
    }
    return AuthenticationMiddleware.instance;
  }

  async handler(
    req: HttpRequestInterface,
  ): Promise<Either<UnauthorizedError, ExtraRequestInterface>> {
    const { authorization } = req.headers;

    if (!authorization) {
      return left(new UnauthorizedError('Missing authorization header'));
    }

    const [method, token] = authorization.split(' ');

    if (method.toLowerCase() !== authConfig.method.toLowerCase() || !token) {
      return left(new UnauthorizedError('Invalid token'));
    }

    const jwt_decoded = HashGeneration.validJWT(token) as tokenPropsInterface;

    const resp: ExtraRequestInterface = {
      user: {
        id: jwt_decoded.id,
        email: jwt_decoded.email,
        type: jwt_decoded.type,
      },
    };

    return right(resp);
  }
}

export const authenticationMiddleware = AuthenticationMiddleware.build();
