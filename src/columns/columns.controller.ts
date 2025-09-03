import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnDto, ColumnsListDto, CreateColumnDto, UpdateColumnDto } from './dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectsService } from '../projects/projects.service';
import { AuthRequest } from '../common/types';
import { AppIdParam } from '../common/validations/app-id-param';
import { CommonHelper } from '../common/utils/helpers';
import { Sequelize } from 'sequelize-typescript';
import { BoardValidationRule } from '../common/validation-rules/board.validation-rule';
import { ProjectsGateway } from '../projects/projects.gateway';
import { TasksService } from '../tasks/tasks.service';

@ApiTags('columns')
@Controller('columns')
export class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
    private readonly projectsService: ProjectsService,
    private readonly sequelize: Sequelize,
    private readonly projectsGateway: ProjectsGateway,
    private readonly tasksService: TasksService,
  ) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ColumnDto })
  @ApiOperation({ summary: 'Create a column' })
  @HttpCode(HttpStatus.CREATED)
  @Post('projects/:id')
  async create(
    @Req() { user }: AuthRequest,
    @Param() { id }: AppIdParam,
    @Body() body: CreateColumnDto,
  ): Promise<ColumnDto> {
    await this.projectsService.getByIdOrThrow(id, [{ method: ['byUser', user.userId] }]);

    const column = await this.columnsService.create({
      ...body,
      projectId: id,
    });

    const response = new ColumnDto(column);

    this.projectsGateway.addColumn(response);

    return response;
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ColumnsListDto })
  @ApiOperation({ summary: 'Get the project columns' })
  @Get('projects/:id')
  async findAll(@Req() { user }: AuthRequest, @Param() { id }: AppIdParam) {
    await this.projectsService.getByIdOrThrow(id);
    await this.projectsService.checkIfMember(user.userId, id);

    const columns = await this.columnsService.getListForBoard(id);

    return new ColumnsListDto(columns);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ColumnDto })
  @ApiOperation({ summary: 'Update the column' })
  @Patch(':id')
  async update(
    @Req() { user }: AuthRequest,
    @Param() { id }: AppIdParam,
    @Body() body: UpdateColumnDto,
  ): Promise<ColumnDto> {
    CommonHelper.checkIfObjectEmpty(body);

    return this.sequelize.transaction(async (transaction) => {
      const column = await this.columnsService.getByIdOrThrow(id, [], transaction);

      const { projectId } = column;
      const { position } = body;

      await this.projectsService.checkIfAdmin(user.userId, projectId, transaction);

      await column.update(body, { transaction });

      if (position && (position % 1 || position === BoardValidationRule.POSITION.MAX)) {
        await this.columnsService.reindex(projectId, transaction);

        await column.reload({ transaction });

        const columns = await this.columnsService.getList([
          { method: ['byProject', projectId] },
          { method: ['orderBy', [[position]]] },
        ]);

        this.projectsGateway.updateColumns(projectId, new ColumnsListDto(columns));
      } else {
        this.projectsGateway.updateColumn(new ColumnDto(column));
      }

      return new ColumnDto(column);
    });
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete the column' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Req() { user }: AuthRequest, @Param() { id }: AppIdParam): Promise<void> {
    return this.sequelize.transaction(async (transaction) => {
      const column = await this.columnsService.getByIdOrThrow(
        id,
        ['withTasks'],
        transaction,
      );
      await this.projectsService.checkIfAdmin(user.userId, column.projectId);

      if (column.tasks) {
        await this.tasksService.deleteAttachments(
          column.tasks.map((task) => task.id),
          transaction,
        );
      }

      await column.destroy({ transaction });

      this.projectsGateway.deleteColumn(column);
    });
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ColumnsListDto })
  @ApiOperation({ summary: 'Get project backlog' })
  @HttpCode(HttpStatus.OK)
  @Get('projects/:id/backlog')
  async getBacklog(
    @Req() { user }: AuthRequest,
    @Param() { id }: AppIdParam,
  ): Promise<ColumnsListDto> {
    await this.projectsService.getByIdOrThrow(id);
    await this.projectsService.checkIfMember(user.userId, id);

    const columns = await this.columnsService.getList([
      { method: ['byProject', id] },
      { method: ['withTasks', [{ method: ['byIsDone', false] }], true] },
      { method: ['orderBy', [['position']]] },
    ]);

    return new ColumnsListDto(columns);
  }
}
