export interface Either<L, R> {
  readonly _tag: 'Left' | 'Right';
  readonly value: L | R;

  isRight(): this is Right<L, R>;
  isLeft(): this is Left<L, R>;

  map<B>(f: (r: R) => B): Either<L, B>;
}

class Right<L, R> implements Either<L, R> {
  readonly _tag = 'Right';
  constructor(readonly value: R) {}

  isRight(): this is Right<L, R> {
    return true;
  }

  isLeft(): this is Left<L, R> {
    return false;
  }

  map<B>(f: (r: R) => B): Either<L, B> {
    return new Right(f(this.value));
  }
}

class Left<L, R> implements Either<L, R> {
  readonly _tag = 'Left';
  constructor(readonly value: L) {}

  isRight(): this is Right<L, R> {
    return false;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  map<B>(f: (r: R) => B): Either<L, B> {
    return new Left(this.value);
  }
}

export class SuccessfulResponse {
  readonly isSuccessful = true;
  constructor(readonly value: any) {}
}

export const right = <L, R>(value: R): Either<L, R> => new Right(value);
export const left = <L, R>(value: L): Either<L, R> => new Left(value);
