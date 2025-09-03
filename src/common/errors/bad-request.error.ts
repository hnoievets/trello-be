import { HttpStatus } from '@nestjs/common';
import { BaseHttpError } from './base-http.error';

export class BadRequestError extends BaseHttpError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
