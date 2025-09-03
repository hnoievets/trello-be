import { Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { VerificationToken } from './entities';
import { InferCreationAttributes, Transaction } from 'sequelize';
import { JwtService } from '@nestjs/jwt';
import { BaseService } from '../common/base';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class VerificationTokensService extends BaseService<
  VerificationToken,
  InferCreationAttributes<VerificationToken>
> {
  constructor(
    @InjectModel(VerificationToken) model: Repository<VerificationToken>,
    private readonly jwtService: JwtService,
  ) {
    super(model);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  create(userId: number, transaction?: Transaction): Promise<VerificationToken> {
    const token = this.jwtService.sign({ userId });

    return this.model.create({ token, userId }, { transaction });
  }
}
