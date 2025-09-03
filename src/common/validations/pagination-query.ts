import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQuery {
  @ApiProperty({
    type: Number,
    required: false,
    default: 0
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly offset = 0;

  @ApiProperty({
    type: Number,
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly limit = 10;
}
