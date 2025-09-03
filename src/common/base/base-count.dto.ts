import { ApiProperty } from '@nestjs/swagger';

export class BaseCountDto {
  constructor(count: number) {
    this.count = count;
  }

  @ApiProperty({ type: Number, required: true })
  count: number;
}
