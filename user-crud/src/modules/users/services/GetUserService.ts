import { Either, left, right } from '@shared/either';
import { UserRepositoryInterface } from '../repositories/userRepository.interface';
import { AppError, NotFoundError, UnauthorizedError } from '@shared/errors';

import { UserMap, UserWebInterface } from '@main/maps/UserMap';
import { userTypes } from '@configs/user';

interface GetRequestInterface {
  user_id: string;
}

export class GetUserService {
  private usersRepository: UserRepositoryInterface;

  private constructor(usersRepository: UserRepositoryInterface) {
    this.usersRepository = usersRepository;
  }

  public static build(usersRepository: UserRepositoryInterface): GetUserService {
    return new GetUserService(usersRepository);
  }

  async execute({
    user_id,
  }: GetRequestInterface): Promise<Either<AppError | NotFoundError, UserWebInterface>> {
    const resp = await this.usersRepository.findOne({
      id: user_id,
    });

    if (resp.isLeft()) return left(resp.value);

    const user = resp.map((resp) => resp).value;

    if (!user) {
      return left(new NotFoundError('User not found'));
    }

    return right(UserMap.toWeb(user));
  }
}
