import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities';
import { Task } from 'src/tasks/entities';
import { BaseScopes } from '../../common/base';

@Scopes(() => ({
  ...BaseScopes,
  byTask: (taskId: number) => ({ where: { taskId } }),
  withUser: (scopes) => ({
    include: [
      {
        model: User.scope(scopes),
        as: 'user',
        required: false,
      },
    ],
  }),
}))
@Table({
  tableName: 'comments',
  timestamps: true,
})
export class Comment extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  taskId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;

  @BelongsTo(() => User, 'userId')
  user?: User;
}
