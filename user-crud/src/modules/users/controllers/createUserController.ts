import { createUserServiceFactory } from '@main/createUserService.factory';
import { Request, Response } from 'express';

export class CreateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, cpf, phone, type } = request.body;
    const createUserService = createUserServiceFactory();

    const resp = await createUserService.execute({
      name,
      email,
      password,
      cpf,
      phone,
      type,
    });

    if (resp.isLeft()) {
      return response.status(400).json({ error: resp.value.message });
    }

    return response.status(201).json(resp.value);
  }
}
