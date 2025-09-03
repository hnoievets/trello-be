import { Injectable } from '@nestjs/common';
import { InferCreationAttributes } from 'sequelize';
import { Comment } from './entities';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../common/base';

@Injectable()
export class CommentsService extends BaseService<
  Comment,
  InferCreationAttributes<Comment>
> {
  constructor(@InjectModel(Comment) protected readonly model: Repository<Comment>) {
    super(model);
  }
}
