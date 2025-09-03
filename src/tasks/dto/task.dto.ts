import { BaseResponseDto } from '../../common/base';
import { Task } from '../entities';
import { ApiProperty } from '@nestjs/swagger';
import { TaskAttachmentDto } from '../../task-attachments/dto';

export class TaskDto extends BaseResponseDto {
  constructor(data: Task) {
    super(data);

    this.projectId = data.projectId;
    this.columnId = data.columnId;
    this.title = data.title;
    this.description = data.description;
    this.estimate = data.estimate;
    this.position = data.position;
    this.isDone = data.isDone;

    this.attachments = data.attachments?.map(
      (attachment) => new TaskAttachmentDto(attachment),
    );
  }

  @ApiProperty({ type: Number, required: true })
  readonly projectId: number;

  @ApiProperty({ type: Number, required: false })
  readonly columnId?: number;

  @ApiProperty({ type: String, required: true })
  readonly title: string;

  @ApiProperty({ type: String, required: false })
  readonly description?: string;

  @ApiProperty({ type: Number, required: false })
  readonly estimate?: number;

  @ApiProperty({ type: Number, required: false })
  readonly position?: number;

  @ApiProperty({ type: Boolean, required: true })
  readonly isDone: boolean;

  @ApiProperty({ type: [TaskAttachmentDto], required: false })
  readonly attachments?: TaskAttachmentDto[];
}
