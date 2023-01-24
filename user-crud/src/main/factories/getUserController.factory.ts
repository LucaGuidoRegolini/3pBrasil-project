import { GetUserController } from '@modules/users/controllers/getUserController';
import { UserRepository } from '@modules/users/repositories/UserRepository';
import { GetUserService } from '@modules/users/services/GetUserService';

export const getUserServiceFactory = (): GetUserService => {
  return GetUserService.build(UserRepository.getInstance());
};

export const getUserControllerFactory = (): GetUserController => {
  const getUserService = GetUserService.build(UserRepository.getInstance());

  return new GetUserController(getUserService);
};
