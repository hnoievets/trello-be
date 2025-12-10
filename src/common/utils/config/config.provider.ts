import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'node:process';

const LOCAL_ENV_LABEL = 'local';

type Validator = (prop: string | undefined) => boolean;

const defaultValidation: Validator = (prop) => !!prop?.length;
const allowEmptyValidation: Validator = (prop) => prop !== undefined;

const configKeyToValidation: Record<string, Validator | null> = {
  SWAGGER_BACKEND_URL: null,

  SWAGGER_TITLE: null,
  FALLBACK_LANGUAGE: null,

  DB_DIALECT: null,
  DB_HOST: null,
  DB_PORT: null,
  DB_USER: null,
  DB_PASSWORD: null,
  DB_NAME: null,

  JWT_SECRET: null,
  JWT_EXPIRES_IN: null,

  REDIS_HOST: null,
  REDIS_PORT: null,
  REDIS_DB: allowEmptyValidation,
  REDIS_PASSWORD: allowEmptyValidation,
  REDIS_PREFIX: null,

  CORS_ORIGINS: null,
  FRONTEND_URL: null,

  AWS_SES_REGION: null,
  AWS_SES_ACCESS_KEY: null,
  AWS_SES_KEY_SECRET: null,
  AWS_SES_FROM_MAIL: null,

  AWS_S3_REGION: null,
  AWS_S3_KEY_SECRET: null,
  AWS_S3_ACCESS_KEY: null,
  AWS_S3_URL_EXPIRES_IN_SEC: null,
  AWS_S3_BUCKET_NAME: null,
};

const provideConfig = () => {
  const nodeEnv = process.env.NODE_ENV ?? LOCAL_ENV_LABEL;

  if (nodeEnv === LOCAL_ENV_LABEL) {
    const envFilePath = path.resolve('./.env.' + nodeEnv);

    return dotenv.parse(fs.readFileSync(envFilePath));
  }

  const config: Record<string, string> = {};

  for (const [key, validation] of Object.entries(configKeyToValidation)) {
    const validator = validation ?? defaultValidation;

    const envValue = process.env[key];

    if (!validator(envValue)) {
      throw new Error(`Invalid environment variable ${key}=${envValue}`);
    }

    config[key] = envValue;
  }

  return config;
};

export const configProvider = {
  provide: 'CONFIG',
  useFactory: provideConfig,
};
