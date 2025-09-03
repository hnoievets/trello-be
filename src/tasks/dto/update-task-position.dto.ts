import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Max, Min } from 'class-validator';
import { BoardValidationRule } from '../../common/validation-rules/board.validation-rule';

export class UpdateTaskPositionDto {
  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @IsPositive()
  readonly columnId: number;

  @ApiProperty({ type: Number, required: true })
  @Min(BoardValidationRule.POSITION.MIN)
  @Max(BoardValidationRule.POSITION.MAX)
  readonly position: number;
}
