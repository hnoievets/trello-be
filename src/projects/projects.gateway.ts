import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import { SessionsService } from 'src/sessions/sessions.service';
import { ProjectsService } from './projects.service';
import { ColumnDto, ColumnsListDto } from '../columns/dto';
import { ColumnModel } from '../columns/entities';
import { TaskDto } from '../tasks/dto';

@WebSocketGateway({ namespace: '/projects' })
export class ProjectsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly projectsService: ProjectsService,
  ) {}

  private getRoomName(projectId: number): string {
    return `project_${projectId}`;
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const { query } = client.handshake;
      const token = query.token as string;
      const projectId = +query.projectId as number;

      const session = await this.sessionsService.findSession(token);

      if (!session || !projectId) {
        throw new UnauthorizedException();
      }

      await this.projectsService.checkIfMember(session.userId, projectId);

      client.join(this.getRoomName(projectId));
    } catch (error) {
      client.emit('ERROR', { error: error.message });
      client.disconnect();
    }
  }

  updateColumn(data: ColumnDto): void {
    this.server.to(this.getRoomName(data.projectId)).emit('UPDATE_COLUMN', { data });
  }

  updateTask(data: TaskDto): void {
    this.server.to(this.getRoomName(data.projectId)).emit('UPDATE_TASK', { data });
  }

  updateBoard(projectId: number, data: ColumnsListDto): void {
    this.server.to(this.getRoomName(projectId)).emit('UPDATE_BOARD', { data });
  }

  addTask(data: TaskDto): void {
    this.server.to(this.getRoomName(data.projectId)).emit('ADD_TASK', { data });
  }

  deleteTask(data: TaskDto): void {
    this.server.to(this.getRoomName(data.projectId)).emit('DELETE_TASK', { data });
  }

  deleteColumn(column: ColumnModel): void {
    this.server
      .to(this.getRoomName(column.projectId))
      .emit('DELETE_COLUMN', { data: { id: column.id } });
  }

  updateColumns(projectId: number, data: ColumnsListDto) {
    this.server.to(this.getRoomName(projectId)).emit('UPDATE_COLUMNS', { data });
  }

  addColumn(data: ColumnDto): void {
    this.server.to(this.getRoomName(data.projectId)).emit('ADD_COLUMN', { data });
  }
}
