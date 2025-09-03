import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NormalizeCase, Trim } from '../../common/utils/transformers';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true })
  @Trim()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ type: String, required: true })
  @Trim()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ type: String, required: true })
  @Trim()
  @NormalizeCase()
  @IsNotEmpty({ message: 'EMAIL_REQUIRED' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String, required: true })
  @Trim()
  @IsNotEmpty({ message: 'PASSWORD_REQUIRED' })
  readonly password: string;
}
