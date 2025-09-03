import { Injectable } from '@nestjs/common';
import { Task, TaskCreationAttributes } from './entities';
import { Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Repository, Sequelize } from 'sequelize-typescript';
import { SequelizeScopes } from '../common/types';
import { BaseService } from '../common/base';
import { Board } from '../common/constants/board';
import { TaskAttachmentsService } from '../task-attachments/task-attachments.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class TasksService extends BaseService<Task, TaskCreationAttributes> {
  constructor(
    @InjectModel(Task) protected readonly model: Repository<Task>,
    private readonly sequelize: Sequelize,
    private readonly taskAttachmentsService: TaskAttachmentsService,
    private readonly filesService: FilesService,
  ) {
    super(model);
  }

  getByIdOrThrow(
    id: number,
    scopes: SequelizeScopes = [],
    transaction?: Transaction,
  ): Promise<Task> {
    return super.getByIdOrThrow(id, scopes, transaction, 'TASK_NOT_FOUND');
  }

  async reindex(columnId: number, transaction: Transaction): Promise<void> {
    const scopes = [{ method: ['byColumn', columnId] }];

    const count = await this.getCount(scopes, transaction);

    const tasks = await this.getList(
      [...scopes, { method: ['orderBy', ['position']] }],
      transaction,
    );

    const limit = 100;
    const iterations = Math.ceil(count / limit);

    for (let i = 0; i < iterations; i++) {
      const updatePayload = tasks.slice(i * limit, (i + 1) * limit).map((task, index) => {
        const globalIndex = i * limit + index;

        const position = (globalIndex + 1) * Board.INITIAL_ELEMENTS_INTERVAL;

        return {
          ...task.dataValues,
          position,
        };
      });

      await this.model.bulkCreate(updatePayload, {
        updateOnDuplicate: ['position'],
        transaction,
      });
    }
  }

  async deleteAttachments(taskIds: number[], transaction: Transaction): Promise<void> {
    const attachments = await this.taskAttachmentsService.getList([
      { method: ['byTask', taskIds] },
    ]);

    if (attachments.length) {
      await this.filesService.deleteByScopesWithS3(
        [{ method: ['byId', attachments.map((item) => item.fileId)] }],
        transaction,
      );
    }
  }
}
