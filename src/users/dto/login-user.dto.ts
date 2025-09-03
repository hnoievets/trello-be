import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NormalizeCase, Trim } from '../../common/utils/transformers';

export class LoginUserDto {
  @ApiProperty({ type: () => String, required: true })
  @Trim()
  @NormalizeCase()
  @IsNotEmpty({ message: 'EMAIL_REQUIRED' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty({ message: 'PASSWORD_REQUIRED' })
  readonly password: string;

  @ApiProperty({ type: () => Number, required: false })
  @IsOptional()
  readonly lifeTime: number;
}
