import { Repository, getRepository } from 'typeorm';
import { UserRepositoryInterface } from './userRepository.interface';
import { User } from '../entities/user';
import {
  IndexRequestInterface,
  IndexResponseInterface,
  ListRequestInterface,
  ListResponseInterface,
} from '@shared/repository/repository.interface';
import { Either, SuccessfulResponse, left, right } from '@shared/either';
import { ConcurrencyError, InternalServerError, NotFoundError } from '@shared/errors';

export class UserRepositoryInMemory implements UserRepositoryInterface {
  private userArray: User[];
  private static instance: UserRepositoryInMemory = UserRepositoryInMemory.build();

  private constructor() {
    this.userArray = [];
  }

  private static build(): UserRepositoryInMemory {
    return new UserRepositoryInMemory();
  }

  public static getInstance(): UserRepositoryInMemory {
    return UserRepositoryInMemory.instance;
  }

  async create(item: User): Promise<Either<InternalServerError, SuccessfulResponse>> {
    try {
      this.userArray.push(item);
    } catch (error: any) {
      const message = error?.message || 'Internal Server Error';
      return left(new InternalServerError(message));
    }
    return right(new SuccessfulResponse(item));
  }

  async update(
    id: string,
    item: Partial<User>,
    retry = 0,
  ): Promise<Either<NotFoundError | ConcurrencyError, SuccessfulResponse>> {
    const resp = this.userArray.find((user) => user.id === id);

    if (!resp) return left(new NotFoundError('User not found'));

    this.userArray.forEach((user) => {
      if (user.id === resp.id && user.version === resp.version) {
        Object.assign(user, item);
        user.version = user.version + 1;
      }
    });

    const user = this.userArray.find((user) => user.id === id);

    if (!user) {
      if (retry >= 1) {
        return this.update(id, item, retry - 1);
      }

      return left(new ConcurrencyError('User has been updated'));
    }

    return right(new SuccessfulResponse(item));
  }

  async delete(
    id: string,
  ): Promise<Either<NotFoundError | InternalServerError, SuccessfulResponse>> {
    try {
      const resp = this.userArray.find((user) => user.id === id);

      if (!resp) {
        return left(new NotFoundError('User not found'));
      }

      this.userArray.filter((user) => user.id !== id);

      return right(new SuccessfulResponse({ id }));
    } catch (error: any) {
      const message = error?.message || 'Internal Server Error';
      return left(new InternalServerError(message));
    }
  }

  async findOne(filter: Partial<User>): Promise<User | undefined> {
    const user = this.userArray.find((user) => user[String(filter)] === filter);

    return user;
  }

  async index(data: IndexRequestInterface<User>): Promise<IndexResponseInterface<User>> {
    const { filter, order, orderBy } = data;

    const orderType = order === 'descending' ? 'DESC' : 'ASC';

    const users = this.userArray
      .filter((user) => {
        if (filter) {
          return user[String(filter)] === filter;
        }
        return user;
      })
      .sort((a, b) => {
        if (a[String(orderBy)] > b[String(orderBy)]) {
          return orderType === 'ASC' ? 1 : -1;
        }
        if (a[String(orderBy)] < b[String(orderBy)]) {
          return orderType === 'ASC' ? -1 : 1;
        }
        return 0;
      });

    return { data: users, ...data };
  }

  async list(data: ListRequestInterface<User>): Promise<ListResponseInterface<User>> {
    const { filter, order, orderBy, page = 1, limit = 10 } = data;

    const orderType = order === 'descending' ? 'DESC' : 'ASC';

    const usersTotal = this.userArray
      .filter((user) => {
        if (filter) {
          return user[String(filter)] === filter;
        }
        return user;
      })
      .sort((a, b) => {
        if (a[String(orderBy)] > b[String(orderBy)]) {
          return orderType === 'ASC' ? 1 : -1;
        }
        if (a[String(orderBy)] < b[String(orderBy)]) {
          return orderType === 'ASC' ? -1 : 1;
        }
        return 0;
      });

    const users = usersTotal.slice((page - 1) * limit, limit);
    const total = usersTotal.length;

    return {
      data: users,
      total,
      page,
      limit,
      ...data,
    };
  }
}
