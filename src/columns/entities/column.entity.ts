import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { BaseScopes } from 'src/common/base/base-scopes';
import { Project } from 'src/projects/entities';
import { Task } from '../../tasks/entities';

@Scopes(() => ({
  ...BaseScopes,
  byProject: (projectId: number) => ({ where: { projectId } }),
  withTasks: (scopes, required = false) => ({
    include: [
      {
        model: Task.scope(scopes),
        as: 'tasks',
        required,
      },
    ],
  }),
}))
@Table({
  tableName: 'columns',
  timestamps: true,
})
export class ColumnModel extends Model {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  projectId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.DECIMAL.UNSIGNED,
    allowNull: false,
    get() {
      return +this.getDataValue('position');
    },
  })
  position: number;

  @HasMany(() => Task, 'columnId')
  tasks?: Task[];
}
