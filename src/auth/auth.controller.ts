import { Body, Controller, Post, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from 'src/auth/guard/bearer-token.guard';

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

  // accessToken 재발급하는 API
  @Post('token/access')
  @UseGuards(AccessTokenGuard)
  accessToken(@Headers('authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken);

    const newToken = this.authService.refreshAccessToken(token, true);
    const newRefreshToken = this.authService.refreshAccessToken(token, false);

    return {
      accessToken: newToken,
      refreshToken: newRefreshToken,
    };
  }

  // refreshToken 재발급하는 API
  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Headers('authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken);

    const newToken = this.authService.refreshAccessToken(token, false);

    return { refreshToken: newToken };
  }
}
