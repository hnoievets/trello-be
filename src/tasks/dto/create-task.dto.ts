import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Trim } from 'src/common/utils/transformers';
import { BoardValidationRule } from '../../common/validation-rules/board.validation-rule';

export class CreateTaskDto {
  @ApiProperty({ type: Number, required: true })
  @IsInt()
  @IsPositive()
  readonly projectId: number;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly columnId?: number;

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

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly estimate?: number;

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @ArrayUnique()
  readonly attachments?: number[];

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Min(BoardValidationRule.POSITION.MIN)
  @Max(BoardValidationRule.POSITION.MAX)
  readonly position?: number;
}
