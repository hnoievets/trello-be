import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AppIdParam {
  @ApiProperty({ type: Number, required: true })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly id: number;
}
