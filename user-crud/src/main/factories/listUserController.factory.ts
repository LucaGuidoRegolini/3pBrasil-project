import { ListUserController } from '@modules/users/controllers/listUserController';
import { UserRepository } from '@modules/users/repositories/UserRepository';
import { ListUserService } from '@modules/users/services/ListUserService';

export const listUserServiceFactory = (): ListUserService => {
  return ListUserService.build(UserRepository.getInstance());
};

export const listUserControllerFactory = (): ListUserController => {
  const listUserService = ListUserService.build(UserRepository.getInstance());

  return new ListUserController(listUserService);
};
