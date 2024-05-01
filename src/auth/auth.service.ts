import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UserModel } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
    private jwtService: JwtService,
  ) {}

  async createUser(user: CreateUserDto) {
    const result = await this.userRepository.existsBy({ email: user.email });

    if (result) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(
      user.password,
      Number(process.env.SALT_ROUNDS),
    );

    await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    return this.login(user);
  }

  async login(user: Pick<UserModel, 'email' | 'password'>) {
    const existingUser = await this.validateUser(user);

    return this.generateLoginToken(existingUser);
  }

  generateLoginToken(user: UserModel) {
    const accessToken = this.signToken({ user, isAccessToken: true });
    const refreshToken = this.signToken({ user, isAccessToken: false });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(user: Pick<UserModel, 'email' | 'password'>) {
    const { email, password } = user;

    const existingUser = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (existingUser) {
      const isValidPassword = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (isValidPassword === true) {
        return existingUser;
      }
    }

    throw new UnauthorizedException(
      '이메일 또는 비밀번호가 일치하지 않습니다.',
    );
  }

  signToken({
    user,
    isAccessToken,
  }: {
    user: Pick<UserModel, 'id' | 'email'>;
    isAccessToken: boolean;
  }) {
    const { id, email } = user;

    const payload = {
      sub: id,
      email,
      type: isAccessToken ? 'access' : 'refresh',
    };

    return this.jwtService.sign(payload, {
      expiresIn: isAccessToken ? '1h' : '30d',
      secret: process.env.JWT_SECRET,
    });
  }

  extractTokenFromHeader(rowToken: string) {
    const splitToken = rowToken.split(' ');

    if (splitToken.length !== 2 || splitToken[0] !== 'Bearer') {
      throw new BadRequestException('Invalid token');
    }
    return splitToken[1];
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  refreshAccessToken(token: string, isAccessToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('decoded.type이 refresh가 아닙니다.');
    }

    return this.signToken({
      user: {
        id: decoded.sub,
        email: decoded.email,
      },
      isAccessToken: isAccessToken,
    });
  }
}
