import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { Project } from 'src/projects/entities';
import { BaseScopes } from 'src/common/base/base-scopes';
import { InferCreationAttributes, Op } from 'sequelize';
import { TaskAttachment } from '../../task-attachments/entities';
import { Comment } from '../../comments/entities';
import { PartialBy } from '../../common/types';

export type TaskCreationAttributes = Omit<
  PartialBy<InferCreationAttributes<Task>, 'isDone'>,
  'attachments'
> & {
  attachments?: { fileId: number }[];
};

@Scopes(() => ({
  ...BaseScopes,
  withoutColumn: {
    where: { columnId: { [Op.is]: null } },
  },
  byColumn: (columnId: number) => ({ where: { columnId } }),
  attributes: (attributes: string[]) => ({ attributes }),
  withAttachments: (scopes) => ({
    include: [
      {
        model: TaskAttachment.scope(scopes),
        as: 'attachments',
        required: false,
      },
    ],
  }),
  withComments: (scopes) => ({
    include: [
      {
        model: Comment.scope(scopes),
        as: 'comments',
        required: false,
      },
    ],
  }),
  byIsDone: (isDone: boolean) => ({ where: { isDone } }),
  byProject: (projectId: number) => ({ where: { projectId } }),
}))
@Table({
  tableName: 'tasks',
  timestamps: true,
})
export class Task extends Model {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  projectId: number;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  columnId?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  estimate?: number;

  @Column({
    type: DataType.DECIMAL.UNSIGNED,
    allowNull: true,
    get() {
      return +this.getDataValue('position') || null;
    },
  })
  position?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isDone: boolean;

  @HasMany(() => TaskAttachment, 'taskId')
  attachments?: TaskAttachment[];

  @HasMany(() => Comment, 'taskId')
  comments?: Comment[];
}
