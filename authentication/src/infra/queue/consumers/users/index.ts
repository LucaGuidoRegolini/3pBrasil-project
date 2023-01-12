import { KafkaAdapter } from '@infra/queue/KafkaAdapter';
import { UpdateUserServiceFactory } from '@main/factories/updateUserService.factory';
import { ModifyUserWorker } from '@modules/authenticate/workers/modifyUserWorker';
import { Logger } from '@shared/logger/logger';

export const userConsumers = async (): Promise<void> => {
  const modifyUserWorker = new ModifyUserWorker(
    UpdateUserServiceFactory(),
    KafkaAdapter.getInstance(),
  );

  await modifyUserWorker.execute();

  Logger.info('🐛 User Workers started');
};
