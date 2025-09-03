import { BaseResponseDto } from '../../common/base';
import { ApiProperty } from '@nestjs/swagger';
import { ColumnModel } from '../entities';
import { TaskDto } from '../../tasks/dto';

export class ColumnDto extends BaseResponseDto {
  constructor(data: ColumnModel) {
    super(data);

    this.projectId = data.projectId;
    this.title = data.title;
    this.position = data.position;

    this.tasks = data.tasks?.map((task) => new TaskDto(task));
  }

  @ApiProperty({ type: Number, required: true })
  readonly projectId: number;

  @ApiProperty({ type: String, required: true })
  readonly title: string;

  @ApiProperty({ type: Number, required: true })
  readonly position: number;

  @ApiProperty({ type: [TaskDto], required: false })
  readonly tasks?: TaskDto[];
}
