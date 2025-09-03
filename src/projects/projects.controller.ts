import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, ProjectDto, ProjectsListDto, UpdateProjectDto } from './dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthRequest, SequelizeScopes } from '../common/types';
import { PaginationQuery } from '../common/validations/pagination-query';
import { Project, ProjectCreationAttributes } from './entities';
import { AppIdParam } from '../common/validations/app-id-param';
import { CommonHelper } from '../common/utils/helpers';
import { Sequelize } from 'sequelize-typescript';
import {
  ProjectIncludeProjectMemberCreationAttributes,
  ProjectMember,
} from '../project-members/entities';
import { ProjectMemberAccess } from '../common/resources/projects';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { TasksService } from 'src/tasks/tasks.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly sequelize: Sequelize,
    private readonly projectMembersService: ProjectMembersService,
    private readonly tasksService: TasksService,
  ) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ProjectDto })
  @ApiOperation({ summary: 'Create a project' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Req() { user }: AuthRequest,
    @Body() body: CreateProjectDto,
  ): Promise<ProjectDto> {
    return this.sequelize.transaction(async (transaction) => {
      const { members, ...rest } = body;
      const payload: ProjectCreationAttributes = { ...rest, userId: user.userId };

      if (members) {
        payload.members = await this.projectMembersService.getValidCreatePayload({
          members,
          transaction,
        });
      }

      const project = await this.projectsService.create(payload, {
        include: [{ model: ProjectMember, as: 'members' }],
        transaction,
      });

      return new ProjectDto(project);
    });
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ProjectsListDto })
  @ApiOperation({ summary: 'Get a list of projects' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getList(
    @Req() { user }: AuthRequest,
    @Query() query: PaginationQuery,
  ): Promise<ProjectsListDto> {
    let projects: Project[] = [];

    const scopes: SequelizeScopes = [{ method: ['byMember', user.userId] }];

    const count = await this.projectsService.getCount(scopes);

    if (count > query.offset) {
      projects = await this.projectsService.getList([
        ...scopes,
        'subQueryFalse',
        { method: ['byPagination', query] },
      ]);
    }

    return new ProjectsListDto(projects, count);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ProjectDto })
  @ApiOperation({ summary: 'Get the project' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getById(
    @Req() req: AuthRequest,
    @Param() { id }: AppIdParam,
  ): Promise<ProjectDto> {
    const project = await this.projectsService.getByIdOrThrow(id, [
      { method: ['byMember', req.user.userId] },
      { method: ['withMembers', ['withUser']] },
    ]);

    return new ProjectDto(project);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ProjectDto })
  @ApiOperation({ summary: 'Update the project' })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Req() { user }: AuthRequest,
    @Param() { id }: AppIdParam,
    @Body() body: UpdateProjectDto,
  ): Promise<ProjectDto> {
    CommonHelper.checkIfObjectEmpty(body);

    return this.sequelize.transaction(async (transaction) => {
      const project = await this.projectsService.getByIdOrThrow(
        id,
        [
          { method: ['byMember', user.userId, ProjectMemberAccess.ADMIN] },
          { method: ['withMembers', ['withUser']] },
        ],
        transaction,
      );

      const { members, ...payload } = body;

      const currentMembers = project.members;

      if (members) {
        const promises = [];

        const updatePayload = (await this.projectMembersService.getValidCreatePayload({
          projectId: id,
          members,
          transaction,
        })) as Required<ProjectIncludeProjectMemberCreationAttributes>[];

        promises.push(
          this.projectMembersService.bulkCreate(updatePayload, transaction, {
            updateOnDuplicate: ['access'],
          }),
        );

        const deleted = currentMembers.filter(
          ({ user: { email } }) => !members.find((member) => email === member.email),
        );

        if (deleted.length) {
          promises.push(
            this.projectMembersService.deleteByScopes(
              [{ method: ['byId', deleted.map(({ id }) => id)] }],
              transaction,
            ),
          );
        }

        await Promise.all(promises);
      }

      if (currentMembers.length && !members) {
        await this.projectMembersService.deleteByScopes(
          [{ method: ['byProject', id] }],
          transaction,
        );
      }

      await project.update(payload, { transaction });

      return new ProjectDto(project);
    });
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete the project' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Req() req: AuthRequest, @Param() { id }: AppIdParam): Promise<void> {
    return this.sequelize.transaction(async (transaction) => {
      const project = await this.projectsService.getByIdOrThrow(
        id,
        [{ method: ['byUser', req.user.userId] }],
        transaction,
      );

      const scopes = [{ method: ['byProject', id] }];

      const count = await this.tasksService.getCount(scopes, transaction);

      const limit = 100;
      const iterations = Math.ceil(count / limit);

      for (let i = 0; i < iterations; i++) {
        const tasks = await this.tasksService.getList(
          [...scopes, { method: ['byPagination', { offset: i * limit, limit }] }],
          transaction,
        );

        await this.tasksService.deleteAttachments(
          tasks.map((task) => task.id),
          transaction,
        );
      }

      return project.destroy({ transaction });
    });
  }
}
