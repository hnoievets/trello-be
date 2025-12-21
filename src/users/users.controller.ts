import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { Public } from '../common/utils/decorators/public.decorator';
import { AuthRequest } from '../common/types';
// eslint-disable-next-line max-len
import { VerificationTokensService } from '../verification-tokens/verification-tokens.service';
import { Sequelize } from 'sequelize-typescript';
import { MailerService } from '../mailer/mailer.service';
import { CommonHelper } from '../common/utils/helpers';
import { FilesService } from '../files/files.service';
import { FileType } from '../common/resources/files';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly verificationTokenService: VerificationTokensService,
    private readonly sequelize: Sequelize,
    private readonly mailerService: MailerService,
    private readonly filesService: FilesService,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({ type: UserDto })
  @ApiOperation({ summary: 'Get current user`s profile' })
  @Get('me')
  async getMyProfile(@Req() req: AuthRequest): Promise<UserDto> {
    // comment to delete
    const user = await this.usersService.getProfile(req.user.userId);

    return new UserDto(user);
  }

  @Public()
  @ApiResponse({ type: UserDto })
  @ApiOperation({ summary: 'Register user' })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async create(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.sequelize.transaction(async (transaction) => {
      const user = await this.usersService.createUser(body, transaction);

      const { token } = await this.verificationTokenService.create(user.id, transaction);

      void this.mailerService.sendVerificationMail(user.email, token);

      return new UserDto(user);
    });
  }

  @ApiBearerAuth()
  @ApiResponse({ type: UserDto })
  @ApiOperation({ summary: 'Update user`s info' })
  @Patch()
  async update(
    @Req() { user: { userId } }: AuthRequest,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    CommonHelper.checkIfObjectEmpty(body);

    return this.sequelize.transaction(async (transaction) => {
      const user = await this.usersService.getById(userId);

      if (body.avatarId) {
        const file = await this.filesService.getByIdOrThrow(
          body.avatarId,
          [
            { method: ['byUser', userId] },
            { method: ['byType', FileType.AVATAR] },
            { method: ['byIsUsed', false] },
          ],

          transaction,
        );

        await file.update({ isUsed: true }, { transaction });
      }

      if (user.avatarId && body.avatarId === null) {
        await this.filesService.deleteByScopesWithS3(
          [{ method: ['byId', user.avatarId] }],
          transaction,
        );
      }

      await user.update(body, { transaction });

      const updatedUser = await this.usersService.getProfile(userId, transaction);

      return new UserDto(updatedUser);
    });
  }
}
