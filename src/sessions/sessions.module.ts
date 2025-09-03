import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerModule } from '../common/utils/logger/logger.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), LoggerModule],
  controllers: [SessionsController],
  providers: [SessionsService, UsersService],
  exports: [SessionsService],
})
export class SessionsModule {}
