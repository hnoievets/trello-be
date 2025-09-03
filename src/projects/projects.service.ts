import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Project, ProjectCreationAttributes } from './entities';
import { BaseService } from '../common/base';
import { Repository } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeScopes } from '../common/types';
import { ForbiddenError } from '../common/errors';
import { ProjectMemberAccess } from '../common/resources/projects';

@Injectable()
export class ProjectsService extends BaseService<Project, ProjectCreationAttributes> {
  constructor(@InjectModel(Project) protected readonly model: Repository<Project>) {
    super(model);
  }

  getByIdOrThrow(
    id: number,
    scopes: SequelizeScopes = [],
    transaction?: Transaction,
  ): Promise<Project> {
    return super.getByIdOrThrow(id, scopes, transaction, 'PROJECT_NOT_FOUND');
  }

  async checkIfMember(userId: number, projectId: number): Promise<void> {
    const project = await this.getById(projectId, [{ method: ['byMember', userId] }]);

    if (!project) {
      throw new ForbiddenError('NOT_PROJECT_MEMBER');
    }
  }

  async checkIfModerator(
    userId: number,
    projectId: number,
    transaction?: Transaction,
  ): Promise<void> {
    const project = await this.getById(
      projectId,
      [
        {
          method: [
            'byMember',
            userId,
            [ProjectMemberAccess.ADMIN, ProjectMemberAccess.WRITE],
          ],
        },
      ],
      transaction,
    );

    if (!project) {
      throw new ForbiddenError('NOT_MODERATOR');
    }
  }

  async checkIfAdmin(
    userId: number,
    projectId: number,
    transaction?: Transaction,
  ): Promise<void> {
    const project = await this.getById(
      projectId,
      [
        {
          method: ['byMember', userId, ProjectMemberAccess.ADMIN],
        },
      ],
      transaction,
    );

    if (!project) {
      throw new ForbiddenError('NOT_ADMIN');
    }
  }
}
