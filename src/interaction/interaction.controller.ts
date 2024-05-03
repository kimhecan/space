import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/@shared/decorator/user.decorator';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UserModel } from 'src/user/entity/user.entity';
import { InteractionService } from './interaction.service';

@Controller('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post('curious/:postId')
  @UseGuards(AccessTokenGuard)
  async postCurious(
    @User() user: UserModel,
    @Param('postId', ParseIntPipe) postId: number,
    @Query('spaceId', ParseIntPipe) spaceId: number,
  ) {
    return await this.interactionService.postCurious(postId, user.id, spaceId);
  }

  @Post('like/:chatId?spaceId=:spaceId')
  @UseGuards(AccessTokenGuard)
  async chatLike(
    @User() user: UserModel,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Query('spaceId', ParseIntPipe) spaceId: number,
  ) {
    return await this.interactionService.chatLike(chatId, user.id, spaceId);
  }

  @Get('statistic')
  @UseGuards(AccessTokenGuard)
  async getStatistic(
    @User() user: UserModel,
    @Query('spaceId', ParseIntPipe) spaceId: number,
  ) {
    return await this.interactionService.getStatistic(spaceId, user.id);
  }
}
