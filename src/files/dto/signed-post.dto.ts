import { File } from '../entities';
import { ApiProperty } from '@nestjs/swagger';
import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { FileDto } from './file.dto';

class AwsPresignedPostDto {
  constructor(signedPost: PresignedPost) {
    this.url = signedPost.url;
    this.fields = signedPost.fields;
  }

  @ApiProperty({ type: String, required: true })
  readonly url: string;

  @ApiProperty({ type: Object, required: true })
  readonly fields: Record<string, string>;
}

export class SignedPostDto {
  constructor(signedPost: PresignedPost, file: File) {
    this.signedPost = new AwsPresignedPostDto(signedPost);
    this.file = new FileDto(file);
  }

  @ApiProperty({ type: AwsPresignedPostDto, required: true })
  readonly signedPost: AwsPresignedPostDto;

  @ApiProperty({ type: String, required: true })
  readonly file: FileDto;
}
