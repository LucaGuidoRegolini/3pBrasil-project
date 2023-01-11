import { Either, SuccessfulResponse } from '@shared/either';
import { AppError } from '@shared/errors';

export interface ListRequestInterface<T> {
  filter?: Partial<T>;
  page?: number;
  limit?: number;
  order?: 'descending' | 'ascending';
  orderBy?: Partial<T>;
}

export interface ListResponseInterface<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  filter?: Partial<T>;
  order?: 'descending' | 'ascending';
  orderBy?: Partial<T>;
}

export interface IndexRequestInterface<T> {
  filter?: Partial<T>;
  order?: 'descending' | 'ascending';
  orderBy?: Partial<T>;
}

export interface IndexResponseInterface<T> {
  data: T[];
  filter?: Partial<T>;
  order?: 'descending' | 'ascending';
  orderBy?: Partial<T>;
}

export interface RepositoryInterface<T> {
  /**
   * @description Creates a new record in the database
   * @param item record to be created
   */
  create(item: T): Promise<Either<AppError, SuccessfulResponse>>;

  /**
   * @description Updates a record in the database
   * @param item record params to be updated
   * @param id record id
   * @param retry number of retries
   */
  update(
    id: string,
    item: Partial<T>,
    retry?: number,
  ): Promise<Either<AppError, SuccessfulResponse>>;

  /**
   * @description Deletes a record in the database
   * @param id record id
   */
  delete(id: string): Promise<Either<AppError, SuccessfulResponse>>;

  /**
   * @description Finds a record in the database
   * @param filter record params to be found
   */
  findOne(filter: Partial<T>): Promise<T | undefined>;

  /**
   * @description Finds all record in the database
   * @param filter record params to be found
   * @param order record order
   * @param orderBy record order by
   */
  index(data: IndexRequestInterface<T>): Promise<IndexResponseInterface<T>>;

  /**
   * @description Finds a limited number of records in the database
   * @param filter record params to be found
   * @param page page number
   * @param limit number of records per page
   * @param order order of the records
   * @param orderBy order by
   */
  list(data: ListRequestInterface<T>): Promise<ListResponseInterface<T>>;
}
