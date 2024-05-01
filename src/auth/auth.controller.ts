import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { RefreshTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() { email, password }: Pick<CreateUserDto, 'email' | 'password'>,
  ) {
    return await this.authService.login({
      email,
      password,
    });
  }

  @Post('join')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @Get('token/access')
  @UseGuards(RefreshTokenGuard)
  accessToken(@Headers('Authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken);

    const newToken = this.authService.refreshAccessToken(token, true);
    const newRefreshToken = this.authService.refreshAccessToken(token, false);

    return {
      accessToken: newToken,
      refreshToken: newRefreshToken,
    };
  }

  @Get('token/refresh')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Headers('Authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken);

    const newToken = this.authService.refreshAccessToken(token, false);

    return { refreshToken: newToken };
  }
}
