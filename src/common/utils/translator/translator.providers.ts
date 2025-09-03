import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LanguageInterceptor } from './translator.interceptor';
import { TranslatorFilter } from './translator.filter';

export const translatorProviders = [
  {
    provide: APP_INTERCEPTOR,
    useClass: LanguageInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: TranslatorFilter,
  },
];
