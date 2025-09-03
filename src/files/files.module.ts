import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { entities } from '../common/utils/database/entities';
import { SessionsModule } from '../sessions/sessions.module';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { guardProviders } from '../common/utils/guards/guard.provider';

@Module({
  imports: [SequelizeModule.forFeature(entities), SessionsModule],
  controllers: [FilesController],
  providers: [FilesService, JwtStrategy, ...guardProviders],
  exports: [FilesService],
})
export class FilesModule {}
