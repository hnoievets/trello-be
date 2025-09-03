import { HttpStatus } from '@nestjs/common';
import { BaseHttpError } from './base-http.error';

export class NotFoundError extends BaseHttpError {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
