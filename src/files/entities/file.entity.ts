import { Column, DataType, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { User } from 'src/users/entities';
import { BaseScopes } from 'src/common/base';
import { PartialBy } from 'src/common/types';
import { InferCreationAttributes } from 'sequelize';
import { FileType } from 'src/common/resources/files';

export type FileCreationAttributes = PartialBy<InferCreationAttributes<File>, 'isUsed'>;

@Scopes(() => ({
  ...BaseScopes,
  byType: (type: FileType) => ({ where: { type } }),
  byIsUsed: (isUsed: boolean) => ({ where: { isUsed } }),
}))
@Table({
  tableName: 'files',
  timestamps: true,
})
export class File extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.TINYINT.UNSIGNED,
    allowNull: false,
  })
  type: FileType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  originalName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fileKey: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isUsed: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;
}
