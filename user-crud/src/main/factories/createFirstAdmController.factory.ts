import { KafkaAdapter } from '@infra/queue/KafkaAdapter';
import { CreateFirstAdmController } from '@modules/users/controllers/createFirstAdmController';
import { UserRepository } from '@modules/users/repositories/UserRepository';
import { CreateFirstAdmService } from '@modules/users/services/CreateFirstAdmService';

export const createFirstAdmServiceFactory = (): CreateFirstAdmService => {
  return CreateFirstAdmService.build(
    UserRepository.getInstance(),
    KafkaAdapter.getInstance(),
  );
};

export const createFirstAdmControllerFactory = (): CreateFirstAdmController => {
  const createFirstAdmService = CreateFirstAdmService.build(
    UserRepository.getInstance(),
    KafkaAdapter.getInstance(),
  );
  return new CreateFirstAdmController(createFirstAdmService);
};
