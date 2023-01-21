import { Either, left, right } from '@shared/either';
import { UserRepositoryInterface } from '../repositories/userRepository.interface';
import { AppError } from '@shared/errors';

import { list_user_limit } from '@configs/user';
import { UserMap, UserWebInterface } from '@main/maps/UserMap';

interface ListRequestInterface {
  page?: number;
  limit?: number;
  email?: string;
  name?: string;
}

interface ListResponseInterface {
  users: UserWebInterface[];
  total: number;
  page: number;
  limit: number;
}

export class ListUserService {
  private usersRepository: UserRepositoryInterface;

  private constructor(usersRepository: UserRepositoryInterface) {
    this.usersRepository = usersRepository;
  }

  public static build(usersRepository: UserRepositoryInterface): ListUserService {
    return new ListUserService(usersRepository);
  }

  async execute({
    page = 1,
    limit = 10,
    ...filters
  }: ListRequestInterface): Promise<Either<AppError, ListResponseInterface>> {
    if (limit > list_user_limit) limit = list_user_limit;

    const resp = await this.usersRepository.list({
      page,
      limit,
      filter: {
        ...filters,
      },
    });

    if (resp.isLeft()) return left(resp.value);

    const repository_resp = resp.map((resp) => resp);

    return right({
      users: repository_resp.data.map((user) => UserMap.toWeb(user)),
      total: repository_resp.total,
      page: repository_resp.page,
      limit: repository_resp.limit,
    });
  }
}
