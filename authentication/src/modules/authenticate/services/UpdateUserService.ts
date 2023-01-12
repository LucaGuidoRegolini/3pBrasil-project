import { HashGeneration } from '@shared/hashGeneration/hashGeneration';
import { UserRepositoryInterface } from '../repositories/userRepository.interface';
import { Logger } from '@shared/logger/logger';
import { Either, SuccessfulResponse, left } from '@shared/either';
import { AppError, ConcurrencyError } from '@shared/errors';

interface UpdateUserRequestInterface {
  email: string;
  passwordHash: string;
  type: string;
  version: number;
}

export class UpdateUserService {
  private usersRepository: UserRepositoryInterface;

  private constructor(usersRepository: UserRepositoryInterface) {
    this.usersRepository = usersRepository;
  }

  public static build(usersRepository: UserRepositoryInterface): UpdateUserService {
    return new UpdateUserService(usersRepository);
  }

  public async execute(
    data: UpdateUserRequestInterface,
  ): Promise<Either<AppError, SuccessfulResponse>> {
    const { email, passwordHash, type, version } = data;
    const user = await this.usersRepository.findOne({
      email: email,
    });

    if (!user) {
      return await this.createUser(email, passwordHash, type);
    }

    if (user.version > version) return left(new ConcurrencyError('Version conflict'));

    return await this.updateUser(user.id, email, passwordHash, type, version);
  }

  private async createUser(
    email: string,
    passwordHash: string,
    type: string,
  ): Promise<Either<AppError, SuccessfulResponse>> {
    const id = HashGeneration.generateUUID();

    const newUser = {
      id,
      email,
      password: passwordHash,
      type,
    };

    const resp = await this.usersRepository.create(newUser);

    return resp;
  }

  private async updateUser(
    id: string,
    email: string,
    passwordHash: string,
    type: string,
    version: number,
  ): Promise<Either<AppError, SuccessfulResponse>> {
    const user = {
      id,
      email,
      password: passwordHash,
      type,
      version,
    };

    const resp = await this.usersRepository.update(id, user, 3);

    return resp;
  }
}
