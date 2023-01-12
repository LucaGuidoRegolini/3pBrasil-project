import { Either, SuccessfulResponse } from '@shared/either';
import { AppError } from '@shared/errors';

export interface QueueInterface {
  addEvent(event: string, message: string): Promise<void>;
  publishEvent(
    event: string,
    retry?: number,
  ): Promise<Either<AppError, SuccessfulResponse>>;
  consumeEvent(event: string, callback: (message: string) => void): Promise<void>;
}
