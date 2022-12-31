import { Request, Response } from 'express';

export class CreateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    throw new Error('Error message');

    return response.status(201).send();
  }
}
