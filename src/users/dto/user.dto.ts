import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities';
import { BaseResponseDto } from '../../common/base';
import { FileDto } from '../../files/dto';

export class UserDto extends BaseResponseDto {
  constructor(data: User) {
    super(data);

    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.isVerified = data.isVerified;
    this.avatar = data.avatar && new FileDto(data.avatar);
  }

  @ApiProperty({ type: String, required: true })
  readonly firstName: string;

  @ApiProperty({ type: String, required: true })
  readonly lastName: string;

  @ApiProperty({ type: String, required: true })
  readonly email: string;

  @ApiProperty({ type: Boolean, required: true })
  readonly isVerified: boolean;

  @ApiProperty({ type: FileDto, required: false })
  readonly avatar?: FileDto;
}
