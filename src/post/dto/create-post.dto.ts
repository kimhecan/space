import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { PostType } from 'src/post/type';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(PostType)
  type: PostType;

  @IsBoolean()
  anonymous: boolean;

  attachmentUrl?: string;
}
