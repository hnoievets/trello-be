import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities';
import { BaseScopes } from 'src/common/base/base-scopes';
import {
  ProjectIncludeProjectMemberCreationAttributes,
  ProjectMember,
} from 'src/project-members/entities';
import { InferCreationAttributes, Op, WhereOptions } from 'sequelize';
import { ProjectMemberAccess } from '../../common/resources/projects';

export type ProjectCreationAttributes = Omit<
  InferCreationAttributes<Project>,
  'members'
> & {
  members?: ProjectIncludeProjectMemberCreationAttributes[];
};

@Scopes(() => ({
  ...BaseScopes,
  byMember: (userId: number, access?: ProjectMemberAccess | ProjectMemberAccess[]) => {
    let membersFilter: WhereOptions<any> = {
      '$members.userId$': userId,
    };

    if (access !== undefined) {
      membersFilter = {
        [Op.and]: {
          '$members.userId$': userId,
          '$members.access$': access,
        },
      };
    }

    return {
      include: [
        {
          model: ProjectMember,
          as: 'members',
          required: false,
        },
      ],
      where: {
        [Op.or]: {
          userId,
          ...membersFilter,
        },
      },
    };
  },
  withMembers: (scopes) => ({
    include: [
      {
        model: ProjectMember.scope(scopes),
        as: 'members',
        required: false,
      },
    ],
  }),
}))
@Table({
  tableName: 'projects',
  timestamps: true,
})
export class Project extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  userId: number;

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

  @HasMany(() => ProjectMember, 'projectId')
  members?: ProjectMember[];
}
