import { ProjectMemberAccess } from 'src/common/resources/projects';
import { BaseResponseDto } from '../../common/base';
import { ApiProperty } from '@nestjs/swagger';
import { SwaggerHelper } from 'src/common/utils/helpers';
import { ProjectMember } from '../entities';
import { UserDto } from '../../users/dto';

export class ProjectMemberDto extends BaseResponseDto {
  constructor(model: ProjectMember) {
    super(model);

    this.projectId = model.projectId;
    this.userId = model.userId;
    this.access = model.access;

    this.user = model.user && new UserDto(model.user);
  }

  @ApiProperty({ type: Number, required: true })
  readonly projectId: number;

  @ApiProperty({ type: Number, required: true })
  readonly userId: number;

  @ApiProperty({
    type: Number,
    required: true,
    enum: ProjectMemberAccess,
    description: SwaggerHelper.enumToDescription(ProjectMemberAccess),
  })
  readonly access: ProjectMemberAccess;

  @ApiProperty({ type: UserDto, required: false })
  readonly user?: UserDto;
}
