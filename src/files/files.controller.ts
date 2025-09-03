import { Controller, Post, Body, Req } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateSignedUrlDto, SignedPostDto } from './dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';
import { AuthRequest } from '../common/types';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: SignedPostDto })
  @ApiOperation({ summary: 'Create a pre-signed url' })
  @Post()
  async create(
    @Req() { user: { userId } }: AuthRequest,
    @Body() body: CreateSignedUrlDto,
  ): Promise<SignedPostDto> {
    const fileKey = `files/${userId}/` + uuid();
    const presignedPost = await this.filesService.createSignedUrl(
      fileKey,
      body.contentType,
    );

    const file = await this.filesService.create({
      userId,
      fileKey,
      url: presignedPost.url + fileKey,
      ...body,
    });

    return new SignedPostDto(presignedPost, file);
  }
}
