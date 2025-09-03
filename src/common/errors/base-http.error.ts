import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseHttpError extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(
      {
        message,
        errorCode: message,
        statusCode,
      },
      statusCode
    );
  }
}
