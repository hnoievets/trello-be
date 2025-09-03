import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['firstName', 'lastName']),
) {
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly avatarId?: number;
}
