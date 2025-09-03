import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Trim } from 'src/common/utils/transformers';
import { Type } from 'class-transformer';
import { CreateProjectMemberDto } from '../../project-members/dto';

export class CreateProjectDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @Trim()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @Trim()
  @IsNotEmpty()
  readonly description?: string;

  @ApiProperty({ type: [CreateProjectMemberDto], required: false })
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectMemberDto)
  readonly members?: CreateProjectMemberDto[];
}
