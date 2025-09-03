import { Injectable } from '@nestjs/common';
import { InferCreationAttributes, Transaction } from 'sequelize';
import { ProjectIncludeProjectMemberCreationAttributes, ProjectMember } from './entities';
import { BaseService } from '../common/base';
import { Repository } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { NotFoundError } from '../common/errors';
import { UsersService } from 'src/users/users.service';
import { CreateProjectMemberDto } from './dto';

@Injectable()
export class ProjectMembersService extends BaseService<
  ProjectMember,
  InferCreationAttributes<ProjectMember>
> {
  constructor(
    @InjectModel(ProjectMember) protected readonly model: Repository<ProjectMember>,
    private readonly usersService: UsersService,
  ) {
    super(model);
  }

  async getValidCreatePayload({
    members,
    projectId,
    transaction,
  }: {
    members: CreateProjectMemberDto[];
    projectId?: number;
    transaction?: Transaction;
  }): Promise<ProjectIncludeProjectMemberCreationAttributes[]> {
    const users = await this.usersService.getList(
      [{ method: ['byEmail', members.map((m) => m.email)] }],
      transaction,
    );

    if (users.length !== members.length) {
      throw new NotFoundError('MEMBERS_NOT_FOUND');
    }

    return users.map(({ id, email }) => {
      const item: ProjectIncludeProjectMemberCreationAttributes = {
        userId: id,
        access: members.find((member) => member.email === email).access,
      };

      if (projectId) {
        item.projectId = projectId;
      }

      return item;
    });
  }
}
