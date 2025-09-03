import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Trim } from 'src/common/utils/transformers';
import { BoardValidationRule } from '../../common/validation-rules/board.validation-rule';

export class CreateColumnDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @Trim()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ type: Number, required: true })
  @Min(BoardValidationRule.POSITION.MIN)
  @Max(BoardValidationRule.POSITION.MAX)
  readonly position: number;
}
