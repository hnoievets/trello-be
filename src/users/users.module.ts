import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { guardProviders } from '../common/utils/guards/guard.provider';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SessionsModule } from '../sessions/sessions.module';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { MailerModule } from '../mailer/mailer.module';
import { VerificationTokensModule } from '../verification-tokens/verification-tokens.module';
import { entities } from '../common/utils/database/entities';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    SequelizeModule.forFeature(entities),
    SessionsModule,
    MailerModule,
    VerificationTokensModule,
    FilesModule,
  ],
  providers: [UsersService, JwtStrategy, ...guardProviders],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
