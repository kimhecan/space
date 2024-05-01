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
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @User() user,
    @Query('spaceId', ParseIntPipe) spaceId,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(spaceId, user.id, createPostDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  listPostFromSpace(@User() user, @Query('spaceId', ParseIntPipe) spaceId) {
    return this.postService.listPostFromSpace(spaceId, user.id);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  listPostFromMe(@User() user) {
    return this.postService.listPostFromMe(user.id);
  }

  @Delete(':postId')
  @UseGuards(AccessTokenGuard)
  async deletePost(
    @User() user,
    @Query('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    await this.postService.deletePost(spaceId, postId, user.id);
  }
}
