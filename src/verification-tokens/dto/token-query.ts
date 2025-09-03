import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class TokenQuery {
  @ApiProperty({ type: String, required: true })
  @IsJWT()
  token: string;
}
