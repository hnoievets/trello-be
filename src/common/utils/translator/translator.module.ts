import { Module, DynamicModule, Global } from '@nestjs/common';
import { TranslatorService } from './translator.service';
import { TranslatorModuleOptionsInterface } from './translator.interface';
import * as path from 'path';
import * as process from 'node:process';
import { translatorProviders } from './translator.providers';
import { ConfigService } from '../config/config.service';

@Global()
@Module({})
export class TranslatorModule {
  static forRoot(options: TranslatorModuleOptionsInterface): DynamicModule {
    const translatorServiceProvider = {
      provide: TranslatorService,
      useFactory: () => {
        const defaultLang = options.defaultLang || 'en';
        const translationSource = options.translationSource || './locales';

        return new TranslatorService(defaultLang, translationSource);
      },
    };
    return {
      module: TranslatorModule,
      providers: [...translatorProviders, translatorServiceProvider],
      exports: [translatorServiceProvider],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => TranslatorModuleOptionsInterface;
    inject?: any[];
  }): DynamicModule {
    const translatorServiceProvider = {
      provide: TranslatorService,
      useFactory: async (...args: any[]) => {
        const opts = options.useFactory(...args);
        const defaultLang = opts.defaultLang || 'en';
        const translationSource = opts.translationSource || './locales';

        return new TranslatorService(defaultLang, translationSource);
      },
      inject: options.inject || [],
    };
    return {
      module: TranslatorModule,
      providers: [...translatorProviders, translatorServiceProvider],
      exports: [translatorServiceProvider],
    };
  }
}

export const RootTranslatorModule = TranslatorModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    defaultLang: configService.get('FALLBACK_LANGUAGE') || 'en',
    translationSource: path.join(process.cwd(), 'locales'),
  }),
  inject: [ConfigService],
});
