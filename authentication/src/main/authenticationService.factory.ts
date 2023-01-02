export const authenticationServiceFactory = () => {
  const {
    AuthenticationService,
  } = require('@modules/authenticate/services/AuthenticateUserService');
  const { UserRepository } = require('@modules/authenticate/repositories/UserRepository');

  return AuthenticationService.build(UserRepository.getInstance());
};
