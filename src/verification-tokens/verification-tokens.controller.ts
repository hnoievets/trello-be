import {
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { VerificationTokensService } from './verification-tokens.service';
import { JwtService } from '@nestjs/jwt';
import { Sequelize } from 'sequelize-typescript';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenQuery } from './dto';
import { UsersService } from '../users/users.service';
import { Public } from '../common/utils/decorators/public.decorator';

@ApiTags('verification')
@Controller('verification')
export class VerificationTokensController {
  constructor(
    private readonly verificationTokensService: VerificationTokensService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly sequelize: Sequelize,
  ) {}

  @Public()
  @ApiOperation({ summary: 'Verify a token' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put()
  async verify(@Query() { token }: TokenQuery) {
    let userId: number;

    try {
      ({ userId } = this.jwtService.verify(token));
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    const tokenModel = await this.verificationTokensService.getOne([
      { method: ['byToken', token] },
    ]);

    if (!tokenModel) {
      throw new NotFoundException('TOKEN_NOT_FOUND');
    }

    if (tokenModel.userId !== userId) {
      throw new ForbiddenException('TOKEN_NOT_OWN');
    }

    if (tokenModel.isUsed) {
      throw new UnauthorizedException('TOKEN_USED');
    }

    await this.sequelize.transaction((transaction) =>
      Promise.all([
        this.usersService.updateById(userId, { isVerified: true }, transaction),
        tokenModel.update({ isUsed: true }, { transaction }),
      ]),
    );
  }
}
