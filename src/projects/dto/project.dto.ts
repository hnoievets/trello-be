import { BaseResponseDto } from '../../common/base';
import { Project } from '../entities';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectMemberDto } from '../../project-members/dto';

export class ProjectDto extends BaseResponseDto {
  constructor(data: Project) {
    super(data);

    this.userId = data.userId;
    this.title = data.title;
    this.description = data.description;

    this.members = data.members?.map((member) => new ProjectMemberDto(member));
  }

  @ApiProperty({ type: Number, required: true })
  readonly userId: number;

  @ApiProperty({ type: String, required: true })
  readonly title: string;

  @ApiProperty({ type: String, required: false })
  readonly description?: string;

  @ApiProperty({ type: [ProjectMemberDto], required: false })
  readonly members?: ProjectMemberDto[];
}
