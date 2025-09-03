import {
  Table,
  Column,
  Model,
  Scopes,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PasswordHelper } from '../../common/utils/helpers/password.helper';
import { File } from '../../files/entities';

@Scopes(() => ({
  byRoles: (role: number) => ({
    where: { role },
  }),
  byEmail: (email: string | string[]) => ({ where: { email } }),
  withAvatar: () => ({
    include: [
      {
        model: File,
        as: 'avatar',
        required: false,
      },
    ],
  }),
}))
@Table({
  tableName: 'users',
  timestamps: true,
  underscored: false,
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  salt: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified: boolean;

  @ForeignKey(() => File)
  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  avatarId?: number;

  @BelongsTo(() => File, 'avatarId')
  avatar?: File;

  @BeforeCreate
  static hashPasswordBeforeCreate(model) {
    if (model.password) {
      model.salt = PasswordHelper.generateSalt();
      model.password = PasswordHelper.hash(model.password + model.salt);
    }
  }

  @BeforeUpdate
  static hashPasswordBeforeUpdate(model) {
    if (model.password && model.changed('password')) {
      model.salt = PasswordHelper.generateSalt();
      model.password = PasswordHelper.hash(model.password + model.salt);
    }
  }
}
