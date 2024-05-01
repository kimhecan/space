import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserModel } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
  ) {}

  findOneByEmail(email: string): Promise<UserModel | null> {
    return this.userRepository.findOneBy({ email });
  }

  findOneById(id: number): Promise<UserModel | null> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserProfileDto: UpdateUserDto) {
    const { password, name, gender, profileImage } = updateUserProfileDto;

    const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

    // 이메일을 제외한 나머지를 수정할 수 있습니다.
    await this.userRepository.update(
      { id },
      {
        name,
        gender,
        profileImage,
        password: hashedPassword,
      },
    );

    return {
      message: '프로필이 수정되었습니다.',
    };
  }
}
