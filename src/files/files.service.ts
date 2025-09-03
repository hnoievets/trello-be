import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base';
import { File, FileCreationAttributes } from './entities';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '../common/utils/config/config.service';
import {
  createPresignedPost,
  PresignedPost,
  PresignedPostOptions,
} from '@aws-sdk/s3-presigned-post';
import { Transaction } from 'sequelize';
import { SequelizeScopes } from '../common/types';

@Injectable()
export class FilesService extends BaseService<File, FileCreationAttributes> {
  private readonly s3: S3;
  private readonly bucketName: string;
  private readonly urlExpiresIn: number;

  constructor(
    @InjectModel(File) protected readonly model: Repository<File>,
    private readonly configService: ConfigService,
  ) {
    super(model);

    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
    this.urlExpiresIn = this.configService.get('AWS_S3_URL_EXPIRES_IN');

    this.s3 = new S3({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_KEY_SECRET'),
      },
    });
  }

  async createSignedUrl(fileKey: string, contentType: string): Promise<PresignedPost> {
    const contentTypeCondition = {
      'Content-Type': contentType,
    };

    const params: PresignedPostOptions = {
      Bucket: this.bucketName,
      Key: fileKey,
      Conditions: [contentTypeCondition],
      Fields: contentTypeCondition,
      Expires: this.urlExpiresIn,
    };

    return createPresignedPost(this.s3, params);
  }

  private async deleteFromS3(files: File[]): Promise<void> {
    await this.s3.deleteObjects({
      Bucket: this.bucketName,
      Delete: {
        Objects: files.map(({ fileKey }) => ({ Key: fileKey })),
      },
    });
  }

  async deleteByScopesWithS3(
    scopes: SequelizeScopes,
    transaction: Transaction,
  ): Promise<void> {
    const files = await this.getList(scopes, transaction);

    await this.deleteByScopes(scopes, transaction);
    await this.deleteFromS3(files);
  }
}
