/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/@shared/decorator/user.decorator';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getUserProfile(@User() user, @Param('id', ParseIntPipe) id: number) {
    const idUser = await this.userService.findOneById(id);
    if (idUser) {
      if (idUser.id === user.id) {
        return idUser;
      }
      const { email, ...otherDetails } = idUser;
      return otherDetails;
    }

    throw new NotFoundException('User not found');
  }

  @Patch('profile')
  @UseGuards(AccessTokenGuard)
  async updateProfile(@User() user, @Body() createUserDto: UpdateUserDto) {
    return await this.userService.update(user.id, createUserDto);
  }
}
