export interface ErrorInterface {
  name: string;
  message: string;
  status?: number;
  type?: string;
}

export abstract class AppError extends Error {
  private _name: string;
  private _message: string;
  private _statusCode: number;
  private _type: string;

  constructor({ name, message, status = 400, type = 'ERROR' }: ErrorInterface) {
    super(message);
    this._name = name;
    this._message = message;
    this._statusCode = status;
    this._type = type;
  }

  public get message(): string {
    return this._message;
  }

  public get statusCode(): number {
    return this._statusCode;
  }

  public get type(): string {
    return this._type;
  }

  public get name(): string {
    return this._name;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super({
      name: 'BadRequestError',
      message,
      status: 400,
      type: 'BAD_REQUEST_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super({
      name: 'UnauthorizedError',
      message,
      status: 401,
      type: 'UNAUTHORIZED_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super({
      name: 'NotFoundError',
      message,
      status: 404,
      type: 'NOT_FOUND_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DuplicateError extends AppError {
  constructor(message: string) {
    super({
      name: 'DuplicateError',
      message,
      status: 409,
      type: 'DUPLICATE_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConcurrencyError extends AppError {
  constructor(message: string) {
    super({
      name: 'ConcurrencyError',
      message,
      status: 409,
      type: 'CONCURRENCY_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super({
      name: 'InternalServerError',
      message,
      status: 500,
      type: 'INTERNAL_SERVER_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
