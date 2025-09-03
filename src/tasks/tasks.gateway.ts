import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import { SessionsService } from '../sessions/sessions.service';
import { TasksService } from './tasks.service';
import { CommentDto } from '../comments/dto';
import { Comment } from '../comments/entities';
import { ProjectsService } from '../projects/projects.service';

@WebSocketGateway({ namespace: '/tasks' })
export class TasksGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  private getRoomName(taskId: number): string {
    return `task_${taskId}`;
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const { handshake } = client;
      const token = handshake.query.token as string;
      const taskId = +handshake.auth.taskId as number;

      const session = await this.sessionsService.findSession(token);

      if (!session || !taskId) {
        throw new UnauthorizedException();
      }

      const task = await this.tasksService.getByIdOrThrow(taskId);
      await this.projectsService.checkIfMember(session.userId, task.projectId);

      client.join(this.getRoomName(taskId));
    } catch (error) {
      client.emit('ERROR', { error: error.message });
      client.disconnect();
    }
  }

  addComment(data: CommentDto): void {
    this.server.to(this.getRoomName(data.taskId)).emit('ADD_COMMENT', { data });
  }

  updateComment(data: CommentDto): void {
    this.server.to(this.getRoomName(data.taskId)).emit('UPDATE_COMMENT', { data });
  }

  deleteComment(data: Comment): void {
    this.server
      .to(this.getRoomName(data.taskId))
      .emit('DELETE_COMMENT', { data: { id: data.id } });
  }
}
