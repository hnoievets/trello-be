import {
  Post,
  Body,
  Controller,
  Delete,
  Put,
  HttpStatus,
  Headers,
  HttpCode,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { UsersService } from '../users/users.service';
import { Public } from '../common/utils/decorators/public.decorator';
import { RefreshSessionDto, SessionDto } from './dto';
import { LoginUserDto } from '../users/dto';
import { PasswordHelper } from '../common/utils/helpers/password.helper';
import { IncomingHttpHeaders } from 'http';
import { AuthRequest } from '../common/types';
import { UnprocessableEntityError } from '../common/errors/unprocessable-entity.error';
import { BadRequestError, NotFoundError } from '../common/errors';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @ApiCreatedResponse({ type: SessionDto })
  @ApiOperation({ summary: 'Start session' })
  @Post()
  async create(@Body() body: LoginUserDto): Promise<SessionDto> {
    const user = await this.usersService.getUserByEmail(body.email);

    if (!user) {
      throw new UnprocessableEntityError('WRONG_CREDENTIALS');
    }

    if (!PasswordHelper.compare(`${body.password}${user.salt}`, user.password)) {
      throw new UnprocessableEntityError('WRONG_CREDENTIALS');
    }

    if (!user.isVerified) {
      throw new BadRequestError('USER_NOT_VERIFIED');
    }

    return this.sessionsService.create(user.id, {
      lifeTime: body.lifeTime,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Destroy session' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async logout(
    @Req() req: AuthRequest,
    @Headers() headers: IncomingHttpHeaders,
  ): Promise<void> {
    const accessToken = headers['authorization'].split(' ')[1];

    await this.sessionsService.destroy(req.user.userId, accessToken);
  }

  @Public()
  @ApiCreatedResponse({ type: SessionDto })
  @ApiOperation({ summary: 'Refresh session' })
  @Put()
  async refresh(@Body() body: RefreshSessionDto): Promise<SessionDto> {
    const oldSessionParams = this.sessionsService.verifyToken(body.refreshToken);

    const user = await this.usersService.getById(oldSessionParams.data.userId);

    if (!user) {
      throw new NotFoundError('USER_NOT_FOUND');
    }

    return this.sessionsService.refresh(body.refreshToken);
  }
}
