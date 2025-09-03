import { Request } from 'express';

export interface TranslatorModuleOptionsInterface {
  defaultLang?: string;
  translationSource?: string;
  global?: boolean;
  requestKeyExtractor?: (req: Request | any) => string;
}
