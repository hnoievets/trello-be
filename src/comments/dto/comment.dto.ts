import { BaseResponseDto } from 'src/common/base/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../entities';
import { UserDto } from '../../users/dto';

export class CommentDto extends BaseResponseDto {
  constructor(data: Comment) {
    super(data);

    this.userId = data.userId;
    this.taskId = data.taskId;
    this.text = data.text;

    this.user = data.user && new UserDto(data.user);
  }

  @ApiProperty({ type: Number, required: true })
  readonly userId: number;

  @ApiProperty({ type: Number, required: true })
  readonly taskId: number;

  @ApiProperty({ type: String, required: true })
  readonly text: string;

  @ApiProperty({ type: UserDto, required: false })
  readonly user?: UserDto;
}
