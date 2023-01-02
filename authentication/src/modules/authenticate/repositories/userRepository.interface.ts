import { RepositoryInterface } from '@shared/repository/repository.interface';
import { User } from '../entities/user';

export interface UserRepositoryInterface extends RepositoryInterface<User> {}
