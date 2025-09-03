import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { Project } from 'src/projects/entities';
import { User } from 'src/users/entities';
import { BaseScopes } from 'src/common/base/base-scopes';
import { ProjectMemberAccess } from '../../common/resources/projects';

export type ProjectIncludeProjectMemberCreationAttributes = {
  userId: number;
  access: ProjectMemberAccess;
  projectId?: number;
};

@Scopes(() => ({
  ...BaseScopes,
  withUser: (scopes) => ({
    include: [
      {
        model: User.scope(scopes),
        as: 'user',
        required: false,
      },
    ],
  }),
  byProject: (projectId: number) => ({ where: { projectId } }),
}))
@Table({
  tableName: 'projectMembers',
  timestamps: true,
})
export class ProjectMember extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  projectId: number;

  @Column({
    type: DataType.TINYINT.UNSIGNED,
    allowNull: false,
  })
  access: ProjectMemberAccess;

  @BelongsTo(() => User, 'userId')
  user?: User;
}
