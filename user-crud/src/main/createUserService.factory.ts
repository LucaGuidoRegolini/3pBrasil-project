import { CreateUserService } from '@modules/users/services/CreateUserService';
import { UserRepository } from '@modules/users/repositories/UserRepository';

export const createUserServiceFactory = () => {
  return CreateUserService.build(UserRepository.getInstance());
};
