import { authenticationServiceFactory } from '@main/authenticationService.factory';
import { Request, Response } from 'express';

export class AuthenticateUserController {
  public async handle(request: Request, response: Response) {
    const { email, password } = request.body;

    const authenticationService = authenticationServiceFactory();
    const resp = await authenticationService.execute({ email, password });

    if (resp.isLeft()) {
      throw resp.value;
    }

    return response.json(resp.value);
  }
}
