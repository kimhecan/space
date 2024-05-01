import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/@shared/decorator/user.decorator';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('space/:spaceId/post/:postId/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @User() user,
    @Param('postId', ParseIntPipe) postId,
    @Body() createChatDto: CreateChatDto,
  ) {
    return this.chatService.createChat(createChatDto, user.id, postId);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  findChatFromPost(@Param('postId', ParseIntPipe) postId) {
    return this.chatService.findChatFromPost(postId);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  findChatFromMe(@User() user) {
    return this.chatService.findChatFromMe(user.id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.chatService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(+id, updateChatDto);
  // }

  @Delete(':id')
  remove(
    @User() user,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.chatService.removeChat({
      userId: user.id,
      spaceId,
      postId,
      chatId: id,
    });
  }
}
