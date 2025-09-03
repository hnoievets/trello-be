import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto, CommentsListDto, CreateCommentDto, UpdateCommentDto } from './dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthRequest, SequelizeScopes } from '../common/types';
import { TasksService } from '../tasks/tasks.service';
import { AppIdParam } from '../common/validations/app-id-param';
import { ProjectsService } from '../projects/projects.service';
import { PaginationQuery } from '../common/validations/pagination-query';
import { Comment } from './entities';
import { TasksGateway } from '../tasks/tasks.gateway';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly tasksService: TasksService,
    private readonly projectsService: ProjectsService,
    private readonly tasksGateway: TasksGateway,
  ) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CommentDto })
  @ApiOperation({ summary: 'Create a comment' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Req() { user: { userId } }: AuthRequest,
    @Body() body: CreateCommentDto,
  ): Promise<CommentDto> {
    const task = await this.tasksService.getByIdOrThrow(body.taskId);
    await this.projectsService.checkIfModerator(userId, task.projectId);

    let comment = await this.commentsService.create({
      ...body,
      userId,
    });

    comment = await this.commentsService.getById(comment.id, ['withUser']);

    const response = new CommentDto(comment);

    this.tasksGateway.addComment(response);

    return response;
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentsListDto })
  @ApiOperation({ summary: 'Get task comments' })
  @Get('tasks/:id')
  async findAll(
    @Req() { user: { userId } }: AuthRequest,
    @Param() { id }: AppIdParam,
    @Query() query: PaginationQuery,
  ): Promise<CommentsListDto> {
    const task = await this.tasksService.getByIdOrThrow(id);
    await this.projectsService.checkIfMember(userId, task.projectId);

    let comments: Comment[] = [];

    const scopes: SequelizeScopes = [{ method: ['byTask', id] }];

    const count = await this.commentsService.getCount(scopes);

    if (count > query.offset) {
      comments = await this.commentsService.getList([
        ...scopes,
        'withUser',
        { method: ['orderBy', [['id', 'DESC']]] },
        { method: ['byPagination', query] },
      ]);
    }

    return new CommentsListDto(comments, count);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentDto })
  @ApiOperation({ summary: 'Update the comment' })
  @Put(':id')
  async update(
    @Req() { user: { userId } }: AuthRequest,
    @Param() { id }: AppIdParam,
    @Body() body: UpdateCommentDto,
  ) {
    const comment = await this.commentsService.getByIdOrThrow(id, [
      { method: ['byUser', userId] },
    ]);

    await comment.update(body);

    const response = new CommentDto(comment);

    this.tasksGateway.updateComment(response);

    return new CommentDto(comment);
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete the comment' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Req() { user: { userId } }: AuthRequest, @Param() { id }: AppIdParam) {
    const comment = await this.commentsService.getByIdOrThrow(id, [
      { method: ['byUser', userId] },
    ]);

    await comment.destroy();

    this.tasksGateway.deleteComment(comment);
  }
}
