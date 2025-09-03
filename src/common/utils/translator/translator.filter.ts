import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TranslatorService } from './translator.service';

@Injectable()
@Catch()
export class TranslatorFilter implements ExceptionFilter {
  constructor(private readonly translator: TranslatorService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = exception.message || 'Unknown error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    }

    if (exception?.response?.message) {
      message = exception.response.message;
      if (exception.response.statusCode) {
        statusCode = exception.response.statusCode;
      }
    }

    if (Array.isArray(message)) {
      message = message.map((m) => this.translator.translate(m));
    } else {
      message = this.translator.translate(message);
    }

    res.status(statusCode).json({
      statusCode,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
