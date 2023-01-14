import { CreateUserService } from '@modules/users/services/CreateUserService';
import { UserRepository } from '@modules/users/repositories/UserRepository';
import { KafkaAdapter } from '@infra/queue/KafkaAdapter';

export const createUserServiceFactory = (): CreateUserService => {
  return CreateUserService.build(
    UserRepository.getInstance(),
    KafkaAdapter.getInstance(),
  );
};
