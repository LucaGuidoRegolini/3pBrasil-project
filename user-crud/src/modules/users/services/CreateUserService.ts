import { Either, left, right } from '@shared/either';
import { UserRepositoryInterface } from '../repositories/userRepository.interface';
import { BadRequestError, DuplicateError } from '@shared/errors';
import { HashGeneration } from '@shared/hashGeneration.ts/hashGenaration';
import { QueueInterface } from '@infra/queue/queueInterface';
import { kafka_topic_modify_user } from '@configs/environment_variable';
import { isUserType } from '@configs/user';

interface CreateRequestInterface {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  type: string;
}

interface CreateResponseInterface {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  type: string;
}

export class CreateUserService {
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
  ): CreateUserService {
    return new CreateUserService(usersRepository, queueAdapter);
  }

  async execute({
    name,
    email,
    password,
    cpf,
    phone,
    type,
  }: CreateRequestInterface): Promise<
    Either<DuplicateError | BadRequestError, CreateResponseInterface>
  > {
    const resp = await this.usersRepository.findOne({
      email: email,
    });

    if (resp.isLeft()) {
      return left(resp.value);
    }

    const userAlreadyExists = resp.map((resp) => resp.value);

    if (userAlreadyExists) {
      return left(new DuplicateError('User already exists'));
    }

    if (!isUserType(type)) {
      return left(new BadRequestError('User type is invalid'));
    }

    const id = HashGeneration.generateUUID();
    const passwordHash = await HashGeneration.generateHash(password);

    const neWUer = {
      id,
      name,
      email,
      type,
      phone,
      cpf,
      password: passwordHash,
    };

    const repository_resp = await this.usersRepository.create(neWUer);

    if (repository_resp.isLeft()) {
      return left(repository_resp.value);
    }

    await this.queueAdapter.addEvent(
      kafka_topic_modify_user,
      JSON.stringify({
        email,
        passwordHash,
        type,
        version: 1,
      }),
    );

    const queue_resp = await this.queueAdapter.publishEvent(kafka_topic_modify_user, 3);

    if (queue_resp.isLeft()) {
      this.usersRepository.delete(id);
      return left(queue_resp.value);
    }

    return right(neWUer);
  }
}
