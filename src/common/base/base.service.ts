import { Model, Repository } from 'sequelize-typescript';
import { SequelizeScopes } from '../types';
import { NotFoundError } from '../errors';
import {
  BulkCreateOptions,
  CreateOptions,
  CreationAttributes,
  Transaction,
} from 'sequelize';
import { File } from '../../files/entities';

export class BaseService<T extends Model, C extends CreationAttributes<T>> {
  protected readonly model: Repository<T>;

  constructor(model: Repository<T>) {
    this.model = model;
  }

  getList(scopes = [], transaction?: Transaction): Promise<T[]> {
    return this.model.scope(scopes).findAll({ transaction });
  }

  getCount(scopes = [], transaction?: Transaction): Promise<number> {
    return this.model.scope(scopes).count({ transaction });
  }

  getOne(scopes = [], transaction?: Transaction): Promise<T> {
    return this.model.scope(scopes).findOne({ transaction });
  }

  getById(id: number, scopes: SequelizeScopes = [], transaction?: Transaction) {
    return this.model.scope(scopes).findByPk(id, { transaction });
  }

  async getByIdOrThrow(
    id: number,
    scopes: SequelizeScopes = [],
    transaction?: Transaction,
    message = 'ENTITY_NOT_FOUND',
  ): Promise<T> {
    const item = await this.getById(id, scopes, transaction);

    if (!item) {
      throw new NotFoundError(message);
    }

    return item;
  }

  create(payload: C, options?: CreateOptions<T>): Promise<T> {
    return this.model.create(payload, options);
  }

  async updateByScopes(
    scopes: SequelizeScopes,
    payload: Partial<File>,
    transaction?: Transaction,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.model.scope(scopes).update(payload, { transaction });
  }

  async deleteByScopes(
    scopes: SequelizeScopes,
    transaction: Transaction,
  ): Promise<number> {
    return this.model.scope(scopes).destroy({ transaction });
  }

  bulkCreate(
    payload: C[],
    transaction: Transaction,
    options?: BulkCreateOptions<C>,
  ): Promise<T[]> {
    return this.model.bulkCreate<T>(payload, { transaction, ...options });
  }
}
