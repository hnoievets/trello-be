import { HttpStatus } from '@nestjs/common';
import { BaseHttpError } from './base-http.error';

export class UnprocessableEntityError extends BaseHttpError {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
