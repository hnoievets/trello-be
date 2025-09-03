import { HttpStatus } from '@nestjs/common';
import { BaseHttpError } from './base-http.error';

export class ForbiddenError extends BaseHttpError {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
