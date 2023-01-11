import { getRepository, Repository } from 'typeorm';
import { CreateUserInterface, UserRepositoryInterface } from './userRepository.interface';
import { User } from '../entities/user';
import { Either, SuccessfulResponse, left, right } from '@shared/either';
import { ConcurrencyError, InternalServerError } from '@shared/errors';
import {
  IndexRequestInterface,
  IndexResponseInterface,
  ListRequestInterface,
  ListResponseInterface,
} from '@shared/repository/repository.interface';

export class UserRepository implements UserRepositoryInterface {
  private ormRepository: Repository<User>;
  private static instance: UserRepository = UserRepository.build();

  private constructor() {
    this.ormRepository = getRepository(User);
  }

  private static build(): UserRepository {
    return new UserRepository();
  }

  public static getInstance(): UserRepository {
    return UserRepository.instance;
  }

  public async create(
    item: CreateUserInterface,
  ): Promise<Either<InternalServerError, SuccessfulResponse>> {
    try {
      await this.ormRepository.save(item);
    } catch (error: any) {
      const message = error?.message || 'Internal Server Error';
      return left(new InternalServerError(message));
    }

    return right(new SuccessfulResponse(item));
  }

  public async update(
    id: string,
    item: Partial<User>,
    retry = 0,
  ): Promise<Either<InternalServerError | ConcurrencyError, SuccessfulResponse>> {
    try {
      const resp = await this.ormRepository.findOne(id);

      if (!resp) return left(new InternalServerError('User not found'));

      item.version = resp.version + 1;

      const user = await this.ormRepository
        .createQueryBuilder()
        .update(User)
        .set(item)
        .where('id = :id', { id: resp.id })
        .andWhere('version = :version', { version: resp.version })
        .returning('*')
        .execute();

      if (!user.raw[0]) {
        if (retry >= 1) {
          return this.update(id, item, retry - 1);
        }

        return left(new ConcurrencyError('Concurrency Error'));
      }

      return right(new SuccessfulResponse(item));
    } catch (error: any) {
      const message = error?.message || 'Internal Server Error';
      return left(new InternalServerError(message));
    }
  }

  public async delete(
    id: string,
  ): Promise<Either<InternalServerError, SuccessfulResponse>> {
    try {
      const resp = await this.ormRepository.delete(id);

      if (!resp.affected) return left(new InternalServerError('User not found'));

      return right(new SuccessfulResponse({ id }));
    } catch (error: any) {
      const message = error?.message || 'Internal Server Error';
      return left(new InternalServerError(message));
    }
  }

  public async findOne(filter: Partial<User>): Promise<User | undefined> {
    const user = await this.ormRepository.createQueryBuilder().where(filter).getOne();

    return user;
  }

  async index(data: IndexRequestInterface<User>): Promise<IndexResponseInterface<User>> {
    const { filter, order, orderBy } = data;

    const orderType = order === 'descending' ? 'DESC' : 'ASC';

    const query = this.ormRepository
      .createQueryBuilder()
      .orderBy(`user.${orderBy}`, orderType);

    if (filter) {
      query.where(filter);
    }

    const users = await query.getMany();

    return { data: users, ...data };
  }

  async list(data: ListRequestInterface<User>): Promise<ListResponseInterface<User>> {
    const { filter, order, orderBy, page = 1, limit = 10 } = data;

    const orderType = order === 'descending' ? 'DESC' : 'ASC';

    const query = this.ormRepository
      .createQueryBuilder()
      .orderBy(`user.${orderBy}`, orderType);

    if (filter) {
      query.where(filter);
    }

    const cloneQuery = query.clone();

    query.skip((page - 1) * limit).take(limit);

    const users = await query.getMany();

    const total = await cloneQuery.getCount();

    return {
      data: users,
      total,
      page,
      limit,
      ...data,
    };
  }
}
