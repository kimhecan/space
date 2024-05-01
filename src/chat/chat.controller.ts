import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/@shared/decorator/user.decorator';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @User() user,
    @Query('postId', ParseIntPipe) postId,
    @Body() createChatDto: CreateChatDto,
  ) {
    return this.chatService.createChat(createChatDto, user.id, postId);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  findChatFromPost(@Query('postId', ParseIntPipe) postId) {
    return this.chatService.findChatFromPost(postId);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  findChatFromMe(@User() user) {
    return this.chatService.findChatFromMe(user.id);
  }

  @Delete(':id')
  remove(
    @User() user,
    @Query('spaceId', ParseIntPipe) spaceId: number,
    @Query('postId', ParseIntPipe) postId: number,
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
