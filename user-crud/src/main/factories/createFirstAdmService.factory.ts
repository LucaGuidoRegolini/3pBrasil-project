import { KafkaAdapter } from '@infra/queue/KafkaAdapter';
import { UserRepository } from '@modules/users/repositories/UserRepository';
import { CreateFirstAdmService } from '@modules/users/services/CreateFirstAdmService';

export const createFirstAdmServiceFactory = (): CreateFirstAdmService => {
  return CreateFirstAdmService.build(
    UserRepository.getInstance(),
    KafkaAdapter.getInstance(),
  );
};
