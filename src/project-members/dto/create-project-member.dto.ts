import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { NormalizeCase, Trim } from 'src/common/utils/transformers';
import { ProjectMemberAccess } from '../../common/resources/projects';
import { SwaggerHelper } from '../../common/utils/helpers';

export class CreateProjectMemberDto {
  @ApiProperty({ type: String, required: true })
  @Trim()
  @NormalizeCase()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: Number,
    required: true,
    enum: ProjectMemberAccess,
    description: SwaggerHelper.enumToDescription(ProjectMemberAccess),
  })
  @IsEnum(ProjectMemberAccess)
  readonly access: ProjectMemberAccess;
}
