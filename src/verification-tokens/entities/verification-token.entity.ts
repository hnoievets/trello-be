import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  AllowNull,
  ForeignKey, Scopes,
} from 'sequelize-typescript';
import { User } from 'src/users/entities';

@Scopes(() => ({
  byToken: (token: string) => ({ where: { token } })
}))
@Table({
  tableName: 'verificationTokens',
  timestamps: true,
  underscored: false,
})
export class VerificationToken extends Model<VerificationToken> {
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @Default(false)
  @Column(DataType.STRING)
  token: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isUsed: boolean;
}
