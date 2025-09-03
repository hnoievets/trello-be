import { ConfigService } from '../config/config.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { entities } from './entities';

export const sequelizeProvider = SequelizeModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    dialect: configService.get('DB_DIALECT'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    models: entities,
  }),
  inject: [ConfigService],
});
