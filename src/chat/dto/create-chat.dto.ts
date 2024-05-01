import { IsBoolean, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  content: string;

  @IsBoolean()
  anonymous: boolean;

  parentId?: number;
}
