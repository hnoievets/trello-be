import { BaseResponseDto } from '../../common/base';
import { TaskAttachment } from '../entities';
import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '../../files/dto';

export class TaskAttachmentDto extends BaseResponseDto {
  constructor(data: TaskAttachment) {
    super(data);

    this.taskId = data.taskId;
    this.fileId = data.fileId;

    this.file = data.file && new FileDto(data.file);
  }

  @ApiProperty({ type: Number, required: true })
  readonly taskId: number;

  @ApiProperty({ type: Number, required: true })
  readonly fileId: number;

  @ApiProperty({ type: FileDto, required: false })
  readonly file?: FileDto;
}
