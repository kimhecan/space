import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  update(id: number, updateUserProfileDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserProfileDto);
  }
}
