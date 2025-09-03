import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from './project.dto';
import { Project } from '../entities';
import { BaseCountDto } from 'src/common/base';

export class ProjectsListDto extends BaseCountDto {
  constructor(data: Project[], count: number) {
    super(count);

    this.data = data.map((item) => new ProjectDto(item));
  }

  @ApiProperty({ type: [ProjectDto], required: true })
  data: ProjectDto[];
}
