import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';
import { Trim } from 'src/common/utils/transformers';

export class CreateCommentDto {
  @ApiProperty({ type: Number, required: true })
  @IsInt()
  @IsPositive()
  readonly taskId: number;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @Trim()
  @IsNotEmpty()
  @MaxLength(255)
  readonly text: string;
}
