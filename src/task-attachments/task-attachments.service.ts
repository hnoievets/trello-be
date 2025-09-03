import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { BaseService } from '../common/base';
import { Repository } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { TaskAttachment, TaskAttachmentCreationAttributes } from './entities';
import { FileType } from '../common/resources/files';
import { FilesService } from '../files/files.service';

@Injectable()
export class TaskAttachmentsService extends BaseService<
  TaskAttachment,
  TaskAttachmentCreationAttributes
> {
  constructor(
    @InjectModel(TaskAttachment) protected readonly model: Repository<TaskAttachment>,
    private readonly filesService: FilesService,
  ) {
    super(model);
  }

  async validate(ids: number[], userId: number, transaction: Transaction): Promise<void> {
    const files = await this.filesService.getList(
      [
        { method: ['byId', ids] },
        { method: ['byUser', userId] },
        { method: ['byType', FileType.ATTACHMENT] },
      ],
      transaction,
    );

    if (files.length !== ids.length) {
      throw new BadRequestException('ATTACHMENTS_INVALID');
    }
  }
}
