import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TranslatorService {
  private langs: string[] = [];
  private translations: Record<string, Record<string, string>> = {};
  private currentLanguage: string;

  constructor(
    private defaultLanguage: string,
    private readonly defaultSource: string,
  ) {
    this.findLangs();
    this.loadTranslations();
    this.currentLanguage = this.defaultLanguage;
  }

  /**
   * Set current request`s lang
   */
  setLanguage(lang: string): void {
    if (this.langs.includes(lang)) {
      this.currentLanguage = lang;
    } else {
      this.currentLanguage = this.defaultLanguage;
    }
  }

  /**
   * Translate key with optional replacement
   */
  translate(
    key: string,
    options?: { replace?: { [key: string]: string }; lang?: string },
  ): string {
    const lang = this.currentLanguage;

    const translation =
      this.translations[lang]?.[key] ||
      this.translations[this.defaultLanguage]?.[key] ||
      key;

    if (options?.replace) {
      return this.replacePlaceholders(translation, options.replace);
    }

    return translation;
  }

  /**
   * Load lang from source
   */
  private findLangs(): void {
    const folderPath = this.getSourceFolderPath();

    try {
      const entries = fs.readdirSync(folderPath, { withFileTypes: true });
      this.langs = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
    } catch (error) {
      console.error(`Error reading translations folder: ${error.message}`);
      this.langs = [];
    }
  }

  /**
   * Upload translation
   */
  private loadTranslations(): void {
    const folderPath = this.getSourceFolderPath();

    for (const lang of this.langs) {
      const langPath = path.join(folderPath, lang);
      this.translations[lang] = {};

      try {
        const files = fs.readdirSync(langPath).filter((file) => file.endsWith('.json'));

        for (const file of files) {
          try {
            const filePath = path.join(langPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const parsedContent = JSON.parse(content);

            this.translations[lang] = {
              ...this.translations[lang],
              ...parsedContent,
            };
          } catch (error) {
            console.error(
              `Error reading translation file "${file}" for "${lang}": ${error.message}`,
            );
          }
        }
      } catch (error) {
        console.error(`Error loading translations for "${lang}": ${error.message}`);
        this.translations[lang] = {};
      }
    }
  }

  /**
   * Get path to folder with locals
   */
  private getSourceFolderPath(): string {
    return path.resolve(this.defaultSource);
  }

  /**
   * Replace variables in translation
   */
  private replacePlaceholders(
    template: string,
    replacements: { [key: string]: string },
  ): string {
    let result = template;
    for (const [placeholder, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(`{${placeholder}}`, 'g'), value);
    }
    return result;
  }
}
