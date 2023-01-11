import { Either, left, right } from '@shared/either';
import { UserRepositoryInterface } from '../repositories/userRepository.interface';
import { DuplicateError } from '@shared/errors';
import { HashGeneration } from '@shared/hashGeneration.ts/hashGenaration';

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

  private constructor(usersRepository: UserRepositoryInterface) {
    this.usersRepository = usersRepository;
  }

  public static build(usersRepository: UserRepositoryInterface): CreateUserService {
    return new CreateUserService(usersRepository);
  }

  async execute({
    name,
    email,
    password,
    cpf,
    phone,
    type,
  }: CreateRequestInterface): Promise<Either<DuplicateError, CreateResponseInterface>> {
    const userAlreadyExists = await this.usersRepository.findOne({
      email: email,
    });

    if (userAlreadyExists) {
      return left(new DuplicateError('User already exists'));
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

    const resp = await this.usersRepository.create(neWUer);

    if (resp.isLeft()) {
      return left(resp.value);
    }

    return right(neWUer);
  }
}
