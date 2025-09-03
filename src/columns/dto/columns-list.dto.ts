import { ColumnDto } from './column.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ColumnModel } from '../entities';

export class ColumnsListDto {
  constructor(data: ColumnModel[]) {
    this.data = data.map((column) => new ColumnDto(column));
  }

  @ApiProperty({ type: [ColumnDto], required: true })
  data: ColumnDto[];
}
