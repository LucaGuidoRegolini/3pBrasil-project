import { CreateUserService } from '@modules/users/services/CreateUserService';
import { UserRepository } from '@modules/users/repositories/UserRepository';
import { KafkaAdapter } from '@infra/queue/KafkaAdapter';
import { CreateUserController } from '@modules/users/controllers/createUserController';

export const createUserControllerFactory = (): CreateUserController => {
  const createUserService = CreateUserService.build(
    UserRepository.getInstance(),
    KafkaAdapter.getInstance(),
  );

  return new CreateUserController(createUserService);
};
