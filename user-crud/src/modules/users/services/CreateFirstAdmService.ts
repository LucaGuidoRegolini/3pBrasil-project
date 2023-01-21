import { QueueInterface } from '@infra/queue/queueInterface';
import { UserRepositoryInterface } from '../repositories/userRepository.interface';
import { Either, left, right } from '@shared/either';
import { AppError, DuplicateError, UnauthorizedError } from '@shared/errors';
import { HashGeneration } from '@shared/hashGeneration.ts/hashGenaration';
import { userTypes } from '@configs/user';
import { kafka_topic_modify_user } from '@configs/environment_variable';

interface CreateRequestInterface {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
}

interface CreateResponseInterface {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  type: string;
}

export class CreateFirstAdmService {
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
  ): CreateFirstAdmService {
    return new CreateFirstAdmService(usersRepository, queueAdapter);
  }

  async execute({
    name,
    email,
    password,
    cpf,
    phone,
  }: CreateRequestInterface): Promise<
    Either<UnauthorizedError, CreateResponseInterface>
  > {
    const resp = await this.usersRepository.list({
      page: 1,
      limit: 1,
    });

    if (resp.isLeft()) {
      return left(resp.value);
    }

    const anyUserAlreadyExists = resp.map((resp) => resp);

    if (anyUserAlreadyExists.total > 0) {
      return left(new UnauthorizedError('First adm already exists'));
    }

    const id = HashGeneration.generateUUID();
    const passwordHash = await HashGeneration.generateHash(password);

    const newUser = {
      id,
      name,
      email,
      password: passwordHash,
      cpf,
      phone,
      type: userTypes.ADMIN,
    };

    const repository_resp = await this.usersRepository.create(newUser);

    if (repository_resp.isLeft()) {
      return left(repository_resp.value);
    }

    await this.queueAdapter.addEvent(
      kafka_topic_modify_user,
      JSON.stringify({
        email,
        passwordHash,
        type: userTypes.ADMIN,
        version: 1,
      }),
    );

    const queue_resp = await this.queueAdapter.publishEvent(kafka_topic_modify_user, 3);

    if (queue_resp.isLeft()) {
      this.usersRepository.delete(id);
      return left(queue_resp.value);
    }

    return right(newUser);
  }
}
