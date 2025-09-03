import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base';
import { ColumnModel } from './entities';
import { InferAttributes, InferCreationAttributes, Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Repository, Sequelize } from 'sequelize-typescript';
import { SequelizeScopes } from '../common/types';
import { Board } from '../common/constants/board';

@Injectable()
export class ColumnsService extends BaseService<
  ColumnModel,
  InferCreationAttributes<ColumnModel>
> {
  constructor(
    @InjectModel(ColumnModel) protected readonly model: Repository<ColumnModel>,
  ) {
    super(model);
  }

  getByIdOrThrow(
    id: number,
    scopes: SequelizeScopes = [],
    transaction?: Transaction,
  ): Promise<ColumnModel> {
    return super.getByIdOrThrow(id, scopes, transaction, 'COLUMN_NOT_FOUND');
  }

  async reindex(projectId: number, transaction: Transaction): Promise<void> {
    const scopes = [{ method: ['byProject', projectId] }];

    const count = await this.getCount(scopes, transaction);

    const columns = await this.getList(
      [...scopes, { method: ['orderBy', ['position']] }],
      transaction,
    );

    const limit = 100;
    const iterations = Math.ceil(count / limit);

    for (let i = 0; i < iterations; i++) {
      const updatePayload = columns
        .slice(i * limit, (i + 1) * limit)
        .map((column, index) => {
          const globalIndex = i * limit + index;

          const position = (globalIndex + 1) * Board.INITIAL_ELEMENTS_INTERVAL;

          return {
            ...column.dataValues,
            position,
          };
        });

      await this.model.bulkCreate(updatePayload, {
        updateOnDuplicate: ['position'],
        transaction,
      });
    }
  }

  getListForBoard(id: number, transaction?: Transaction): Promise<ColumnModel[]> {
    return this.getList(
      [
        'subQueryFalse',
        { method: ['byProject', id] },
        {
          method: ['withTasks'],
        },
        {
          method: ['orderBy', [['position'], [Sequelize.col('tasks.position')]]],
        },
      ],
      transaction,
    );
  }

  getMax<T>(
    field: keyof InferAttributes<ColumnModel>,
    scopes?: SequelizeScopes,
    transaction?: Transaction,
  ): Promise<T> {
    return this.model.scope(scopes).max(field, { transaction });
  }
}
