import { Module } from '@nestjs/common';
import { TaskAttachmentsService } from './task-attachments.service';
import { entities } from '../common/utils/database/entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [SequelizeModule.forFeature(entities), FilesModule],
  providers: [TaskAttachmentsService],
  exports: [TaskAttachmentsService],
})
export class TaskAttachmentsModule {}
