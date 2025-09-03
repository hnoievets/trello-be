import { Module } from '@nestjs/common';
import { VerificationTokensController } from './verification-tokens.controller';
import { VerificationTokensService } from './verification-tokens.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { guardProviders } from '../common/utils/guards/guard.provider';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersService } from '../users/users.service';
import { entities } from '../common/utils/database/entities';

@Module({
  imports: [SequelizeModule.forFeature(entities), SessionsModule],
  controllers: [VerificationTokensController],
  providers: [
    VerificationTokensService,
    UsersService,
    JwtStrategy,
    ...guardProviders
  ],
  exports: [VerificationTokensService],
})
export class VerificationTokensModule {}
