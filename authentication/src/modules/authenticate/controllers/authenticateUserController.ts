import { Request, Response } from 'express';
import { AuthenticationService } from '../services/AuthenticateUserService';

export class AuthenticateUserController {
  private authenticationService: AuthenticationService;

  constructor(authenticationService: AuthenticationService) {
    this.authenticationService = authenticationService;
  }

  public async handle(request: Request, response: Response) {
    const { email, password } = request.body;

    const resp = await this.authenticationService.execute({ email, password });

    if (resp.isLeft()) {
      throw resp.value;
    }

    return response.json(resp.value);
  }
}
