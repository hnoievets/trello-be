import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize/types';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../common/base';
import { User } from './entities';
import { InjectModel } from '@nestjs/sequelize';
import { BadRequestError } from '../common/errors';
import { SequelizeScopes } from '../common/types';
import { CreateUserDto } from './dto';
import { InferCreationAttributes } from 'sequelize';

@Injectable()
export class UsersService extends BaseService<User, InferCreationAttributes<User>> {
  constructor(@InjectModel(User) model: Repository<User>) {
    super(model);
  }

  getUserByEmail(
    email: string,
    scopes: SequelizeScopes = [],
    transaction?: Transaction,
  ): Promise<User> {
    return this.model.scope(scopes).findOne({
      where: { email },
      transaction,
    });
  }

  async createUser(body: CreateUserDto, transaction?: Transaction): Promise<User> {
    const user = await this.getUserByEmail(body.email, [], transaction);

    if (user) {
      throw new BadRequestError('USER_ALREADY_EXIST');
    }

    return this.model.create({ ...body }, { transaction });
  }

  getByIdOrThrow(
    id: number,
    scopes: SequelizeScopes = [],
    transaction?: Transaction,
  ): Promise<User> {
    return super.getByIdOrThrow(id, scopes, transaction, 'USER_NOT_FOUND');
  }

  async updateById(
    id: number,
    payload: Partial<User>,
    transaction?: Transaction,
  ): Promise<void> {
    await this.model.update(payload, { where: { id }, transaction });
  }

  getProfile(id: number, transaction?: Transaction): Promise<User> {
    return this.getById(id, [{ method: ['withAvatar'] }], transaction);
  }
}
