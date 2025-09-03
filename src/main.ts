import { NestFactory } from '@nestjs/core';
import { ConfigService } from './common/utils/config/config.service';
import { AppModule } from './app.module';
import { setupSwagger } from './common/utils/appBuilder/setup-swagger';
import { appBuilder } from './common/utils/appBuilder/app-builder.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  await setupSwagger(app, configService);

  await appBuilder(app, configService);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
