import { Either, SuccessfulResponse, left, right } from '@shared/either';
import { UserRepositoryInterface } from '../repositories/userRepository.interface';
import { BadRequestError, NotFoundError, UnauthorizedError } from '@shared/errors';
import { HashGeneration } from '@shared/hashGeneration.ts/hashGenaration';
import { QueueInterface } from '@infra/queue/queueInterface';
import { kafka_topic_modify_user } from '@configs/environment_variable';
import { update_user_retry, userTypes } from '@configs/user';
import { User } from '../entities/user';

interface CreateRequestInterface {
  user_id: string;
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
}

interface CreateResponseInterface {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  type: string;
}

export class UpdateUserService {
  private usersRepository: UserRepositoryInterface;
  private queueAdapter: QueueInterface;

  private constructor(
    usersRepository: UserRepositoryInterface,
    queueAdapter: QueueInterface,
  ) {
    this.usersRepository = usersRepository;
    this.queueAdapter = queueAdapter;
  }

  public static build(
    usersRepository: UserRepositoryInterface,
    queueAdapter: QueueInterface,
  ): UpdateUserService {
    return new UpdateUserService(usersRepository, queueAdapter);
  }

  async execute({
    user_id,
    name,
    email,
    cpf,
    phone,
  }: CreateRequestInterface): Promise<
    Either<NotFoundError | BadRequestError, CreateResponseInterface>
  > {
    const repository_resp = await this.usersRepository.findOne({
      id: user_id,
    });

    if (repository_resp.isLeft()) {
      return left(repository_resp.value);
    }

    const userAlreadyExists = repository_resp.map((resp) => resp.value);

    if (!userAlreadyExists) {
      return left(new NotFoundError('User not found'));
    }

    const neWUer = {
      name,
      email,
      phone,
      cpf,
    };

    const update_resp = await this.usersRepository.update(
      user_id,
      neWUer,
      update_user_retry,
    );

    if (update_resp.isLeft()) {
      return left(update_resp.value);
    }

    const { version } = update_resp.map((resp) => resp.value);
    const { type, password } = userAlreadyExists;

    await this.queueAdapter.addEvent(
      kafka_topic_modify_user,
      JSON.stringify({
        email: email || userAlreadyExists.email,
        passwordHash: password,
        type,
        version,
      }),
    );

    const queue_resp = await this.queueAdapter.publishEvent(kafka_topic_modify_user, 3);

    if (queue_resp.isLeft()) {
      this.usersRepository.delete(user_id);
      return left(queue_resp.value);
    }

    return right({
      id: user_id,
      name: name || userAlreadyExists.name,
      email: email || userAlreadyExists.email,
      cpf: cpf || userAlreadyExists.cpf,
      phone: phone || userAlreadyExists.phone,
      type,
    });
  }
}
