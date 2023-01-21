import { RepositoryInterface } from '@shared/repository/repository.interface';
import { User } from '../entities/user';
import { Either, SuccessfulResponse } from '@shared/either';
import { AppError } from '@shared/errors';

export interface CreateUserInterface {
  id: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  type: string;
}

export interface UserRepositoryInterface extends RepositoryInterface<User> {
  create(
    item: CreateUserInterface,
  ): Promise<Either<AppError, SuccessfulResponse<CreateUserInterface>>>;
}
