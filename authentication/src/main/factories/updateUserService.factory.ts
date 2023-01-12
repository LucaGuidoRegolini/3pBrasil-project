import { UserRepository } from '@modules/authenticate/repositories/UserRepository';
import { UpdateUserService } from '@modules/authenticate/services/UpdateUserService';

export const UpdateUserServiceFactory = () => {
  return UpdateUserService.build(UserRepository.getInstance());
};
