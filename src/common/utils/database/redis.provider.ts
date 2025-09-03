import { DynamicModule } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '../config/config.service';

export const redisModuleInstance: DynamicModule = RedisModule.forRootAsync(
  {
    useFactory: async (configService: ConfigService) => ({
      config: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        db: configService.get('REDIS_DB') || undefined,
        password: configService.get('REDIS_PASSWORD') || undefined,
        keyPrefix: configService.get('REDIS_PREFIX'),
      },
    }),
    inject: [ConfigService],
  },
  true,
);
