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
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('space/:spaceId/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @User() user,
    @Param('spaceId', ParseIntPipe) spaceId,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(spaceId, user.id, createPostDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  getPosts(@User() user, @Param('spaceId', ParseIntPipe) spaceId) {
    return this.postService.listPost(spaceId, user.id);
  }

  @Delete(':postId')
  @UseGuards(AccessTokenGuard)
  async deletePost(
    @User() user,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    await this.postService.deletePost(spaceId, postId, user.id);
  }
}
