import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { LoggerService } from '../logger/logger.service';
import { requestResponseLogger } from '../logger/logger-middleware';

export const appBuilder = async (
  app: INestApplication,
  configService: ConfigService,
): Promise<INestApplication> => {
  app.enableCors({ origin: JSON.parse(configService.get('CORS_ORIGINS')) });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.useLogger(new LoggerService());

  app.use(requestResponseLogger);

  await app.init();
  return app;
};
