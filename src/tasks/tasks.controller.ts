import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, TaskDto, UpdateTaskDto, UpdateTaskPositionDto } from './dto';
import { AuthRequest, SequelizeScopes } from '../common/types';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ColumnsService } from '../columns/columns.service';
import { AppIdParam } from '../common/validations/app-id-param';
import { TaskCreationAttributes } from './entities';
import { ProjectsService } from '../projects/projects.service';
import { CommonHelper } from '../common/utils/helpers';
import { BoardValidationRule } from '../common/validation-rules/board.validation-rule';
import { Sequelize } from 'sequelize-typescript';
import { FilesService } from 'src/files/files.service';
import { TaskAttachmentsService } from '../task-attachments/task-attachments.service';
import { TaskAttachment } from '../task-attachments/entities';
import { ProjectsGateway } from 'src/projects/projects.gateway';
import { ColumnsListDto } from '../columns/dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly columnsService: ColumnsService,
    private readonly projectsService: ProjectsService,
    private readonly sequelize: Sequelize,
    private readonly filesService: FilesService,
    private readonly taskAttachmentsService: TaskAttachmentsService,
    private readonly projectsGateway: ProjectsGateway,
  ) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: TaskDto })
  @ApiOperation({ summary: 'Create a task' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Req() { user }: AuthRequest,
    @Body() body: CreateTaskDto,
  ): Promise<TaskDto> {
    return this.sequelize.transaction(async (transaction) => {
      await this.projectsService.checkIfAdmin(user.userId, body.projectId);

      if (body.columnId) {
        await this.columnsService.getByIdOrThrow(body.columnId, [
          { method: ['byProject', body.projectId] },
        ]);
      }

      const { attachments, ...payload } = body;

      const creationData: TaskCreationAttributes = payload;

      if (attachments?.length) {
        await this.taskAttachmentsService.validate(attachments, user.userId, transaction);

        await this.filesService.updateByScopes(
          [{ method: ['byId', attachments] }],
          { isUsed: true },
          transaction,
        );

        creationData.attachments = attachments.map((fileId) => ({ fileId }));
      }

      const task = await this.tasksService.create(payload, {
        include: { model: TaskAttachment, as: 'attachments' },
        transaction,
      });

      const response = new TaskDto(task);

      this.projectsGateway.addTask(response);

      return response;
    });
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskDto })
  @ApiOperation({ summary: 'Get the task' })
  @Get(':id')
  async findOne(
    @Req() { user }: AuthRequest,
    @Param() { id }: AppIdParam,
  ): Promise<TaskDto> {
    const task = await this.tasksService.getByIdOrThrow(id, [
      { method: ['withAttachments', ['withFile']] },
    ]);
    await this.projectsService.checkIfMember(user.userId, task.projectId);

    return new TaskDto(task);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskDto })
  @ApiOperation({ summary: 'Update the task' })
  @Put(':id')
  async update(
    @Req() { user }: AuthRequest,
    @Param() { id }: AppIdParam,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskDto> {
    CommonHelper.checkIfObjectEmpty(body);

    return this.sequelize.transaction(async (transaction) => {
      const task = await this.tasksService.getByIdOrThrow(id, [], transaction);

      await this.projectsService.checkIfAdmin(user.userId, task.projectId, transaction);

      const { attachments, ...payload } = body;

      const currentAttachments = await this.taskAttachmentsService.getList(
        [{ method: ['byTask', id] }],
        transaction,
      );
      const currentFileIds = currentAttachments.map(({ fileId }) => fileId);

      if (attachments) {
        const added = attachments.filter((id) => !currentFileIds.includes(id));
        const deleted = currentFileIds.filter((fileId) => !attachments.includes(fileId));

        const promises = [];

        if (added.length) {
          await this.taskAttachmentsService.validate(
            attachments,
            user.userId,
            transaction,
          );

          promises.push(
            this.filesService.updateByScopes(
              [{ method: ['byId', added] }],
              { isUsed: true },
              transaction,
            ),
            this.taskAttachmentsService.bulkCreate(
              added.map((fileId) => ({ fileId, taskId: id })),
              transaction,
            ),
          );
        }

        if (deleted.length) {
          promises.push(
            this.filesService.deleteByScopesWithS3(
              [{ method: ['byId', deleted] }],
              transaction,
            ),
          );
        }

        await Promise.all(promises);
      }

      if (currentFileIds.length && !attachments) {
        await this.filesService.deleteByScopesWithS3(
          [{ method: ['byId', currentFileIds] }],
          transaction,
        );
      }

      await task.update(payload, { transaction });

      const response = new TaskDto(task);

      this.projectsGateway.updateTask(response);

      return response;
    });
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskDto })
  @ApiOperation({ summary: 'Update the task position' })
  @Put(':id/position')
  async updatePosition(
    @Req() { user }: AuthRequest,
    @Param() { id }: AppIdParam,
    @Body() body: UpdateTaskPositionDto,
  ): Promise<TaskDto> {
    return this.sequelize.transaction(async (transaction) => {
      const task = await this.tasksService.getByIdOrThrow(id, [], transaction);

      await this.projectsService.checkIfModerator(
        user.userId,
        task.projectId,
        transaction,
      );

      const scopes: SequelizeScopes = [{ method: ['byProject', task.projectId] }];

      const column = await this.columnsService.getByIdOrThrow(
        body.columnId,
        scopes,
        transaction,
      );

      const maxColumnPosition = await this.columnsService.getMax<number>(
        'position',
        scopes,
        transaction,
      );

      await task.update(
        {
          ...body,
          isDone: column.position === maxColumnPosition,
        },
        { transaction },
      );

      const { position } = body;

      if (position && (position % 1 || position === BoardValidationRule.POSITION.MAX)) {
        await this.tasksService.reindex(body.columnId, transaction);

        await task.reload({ transaction });
      }

      const columns = await this.columnsService.getListForBoard(
        task.projectId,
        transaction,
      );
      this.projectsGateway.updateBoard(task.projectId, new ColumnsListDto(columns));

      return new TaskDto(task);
    });
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete the task' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Req() { user }: AuthRequest, @Param() { id }: AppIdParam): Promise<void> {
    return this.sequelize.transaction(async (transaction) => {
      const task = await this.tasksService.getByIdOrThrow(id, [], transaction);
      await this.projectsService.checkIfAdmin(user.userId, task.projectId);

      await this.tasksService.deleteAttachments([id], transaction);

      await task.destroy({ transaction });

      this.projectsGateway.deleteTask(new TaskDto(task));
    });
  }
}
