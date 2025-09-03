import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/common/utils/transformers';
import { FileType } from 'src/common/resources/files';

export class CreateSignedUrlDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @Trim()
  @IsNotEmpty()
  readonly originalName?: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @Trim()
  @IsNotEmpty()
  readonly contentType: string;

  @ApiProperty({ type: String, required: true, enum: FileType })
  @IsEnum(FileType)
  readonly type: FileType;
}
