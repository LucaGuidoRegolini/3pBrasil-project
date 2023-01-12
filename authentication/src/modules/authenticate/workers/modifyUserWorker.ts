import { Logger } from '@shared/logger/logger';
import { UpdateUserService } from '../services/UpdateUserService';
import { QueueInterface } from '@infra/queue/queueInterface';
import { kafka_topic_modify_user } from '@configs/environment_variable';

interface ModifyUserWorkerPayload {
  email: string;
  passwordHash: string;
  type: string;
  version: number;
}

export class ModifyUserWorker {
  private updateUserService: UpdateUserService;
  private queueAdapter: QueueInterface;

  constructor(updateUserService: UpdateUserService, queueAdapter: QueueInterface) {
    this.updateUserService = updateUserService;
    this.queueAdapter = queueAdapter;
  }

  public async execute(): Promise<void> {
    this.queueAdapter.consumeEvent(kafka_topic_modify_user, async (message: string) => {
      console.log('Message received');
      console.log(message);
      const data: ModifyUserWorkerPayload = JSON.parse(message);
      const { email, passwordHash, type, version } = data;
      const resp = await this.updateUserService.execute({
        email,
        passwordHash,
        type,
        version,
      });

      if (resp.isLeft()) {
        Logger.error('Error while updating user');
        Logger.error(resp.value.message);
      }

      Logger.info('User updated');
    });
  }
}
