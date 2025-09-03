import { BaseResponseDto } from 'src/common/base';
import { File } from '../entities';
import { ApiProperty } from '@nestjs/swagger';
import { FileType } from 'src/common/resources/files';
import { SwaggerHelper } from 'src/common/utils/helpers';

export class FileDto extends BaseResponseDto {
  constructor(data: File) {
    super(data);

    this.userId = data.userId;
    this.originalName = data.originalName;
    this.fileKey = data.fileKey;
    this.type = data.type;
    this.isUsed = data.isUsed;
    this.url = data.url;
  }

  @ApiProperty({ type: Number, required: true })
  readonly userId: number;

  @ApiProperty({
    type: Number,
    required: true,
    enum: FileType,
    description: SwaggerHelper.enumToDescription(FileType),
  })
  readonly type: FileType;

  @ApiProperty({ type: String, required: false })
  readonly originalName?: string;

  @ApiProperty({ type: String, required: true })
  readonly fileKey: string;

  @ApiProperty({ type: Boolean, required: true })
  readonly isUsed: boolean;

  @ApiProperty({ type: String, required: true })
  readonly url: string;
}
