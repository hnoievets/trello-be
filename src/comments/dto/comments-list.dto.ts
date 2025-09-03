import { BaseCountDto } from '../../common/base';
import { Comment } from '../entities';
import { CommentDto } from './comment.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CommentsListDto extends BaseCountDto {
  constructor(data: Comment[], count: number) {
    super(count);

    this.data = data.map((item) => new CommentDto(item));
  }

  @ApiProperty({ type: [CommentDto], required: true })
  readonly data: CommentDto[];
}
