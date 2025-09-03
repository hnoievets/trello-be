import { Model } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  constructor(model: Model) {
    this.id = model.id;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;

    for (const key of Object.keys(model.dataValues)) {
      const dataValue = model.getDataValue(key);

      if (dataValue === null) {
        model[key] = undefined;
      }
    }
  }

  @ApiProperty({ type: Number, required: true })
  readonly id: number;

  @ApiProperty({ type: String, required: true })
  readonly createdAt: string;

  @ApiProperty({ type: String, required: true })
  readonly updatedAt: string;
}
