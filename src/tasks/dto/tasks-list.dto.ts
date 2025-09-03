import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from './task.dto';
import { Task } from '../entities';

export class TasksListDto {
  @ApiProperty({ type: [TaskDto], required: true })
  data: TaskDto[];

  @ApiProperty({ type: Number, required: true })
  count: number;

  constructor(data: Task[], count: number) {
    this.data = data.map((item) => new TaskDto(item));
    this.count = count;
  }
}
