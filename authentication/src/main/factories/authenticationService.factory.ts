import { AuthenticationService } from '@modules/authenticate/services/AuthenticateUserService';
import { UserRepository } from '@modules/authenticate/repositories/UserRepository';

export const authenticationServiceFactory = () => {
  return AuthenticationService.build(UserRepository.getInstance());
};
