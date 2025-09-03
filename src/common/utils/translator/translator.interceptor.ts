import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TranslatorService } from './translator.service';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  private readonly languageOptions: string[] = [
    'accept-language',
    'language',
    'lang',
    'l',
  ];

  constructor(private readonly translator: TranslatorService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: any = context.switchToHttp().getRequest();

    const lang =
      this.getLanguageFromHeaders(req) ||
      this.getLanguageFromQuery(req) ||
      this.getLanguageFromBody(req) ||
      'en';

    req['lang'] = lang;
    this.translator.setLanguage(lang);

    return next.handle();
  }

  private getLanguageFromHeaders(req: any): string | undefined {
    for (const option of this.languageOptions) {
      if (req.headers[option]) {
        return req.headers[option];
      }
    }
    return undefined;
  }

  private getLanguageFromQuery(req: any): string | undefined {
    for (const option of this.languageOptions) {
      if (req.query[option]) {
        return req.query[option];
      }
    }
    return undefined;
  }

  private getLanguageFromBody(req: any): string | undefined {
    for (const option of this.languageOptions) {
      if (req?.body[option]) {
        return req.body[option];
      }
    }
    return undefined;
  }
}
