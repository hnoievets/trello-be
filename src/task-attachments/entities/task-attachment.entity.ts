import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { BaseScopes } from 'src/common/base/base-scopes';
import { Task } from '../../tasks/entities';
import { File } from '../../files/entities';
import { InferCreationAttributes } from 'sequelize';

export type TaskAttachmentCreationAttributes = InferCreationAttributes<TaskAttachment>;

@Scopes(() => ({
  ...BaseScopes,
  withFile: {
    include: [
      {
        model: File,
        as: 'file',
        required: false,
      },
    ],
  },
  byTask: (taskId: number) => ({ where: { taskId } }),
}))
@Table({
  tableName: 'taskAttachments',
  timestamps: true,
})
export class TaskAttachment extends Model {
  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  taskId: number;

  @ForeignKey(() => File)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  fileId: number;

  @BelongsTo(() => File, 'fileId')
  file?: File;
}
