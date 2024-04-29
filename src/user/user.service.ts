import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
  ) {}

  findOneById(id: number): Promise<UserModel | null> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<UserModel | null> {
    return this.userRepository.findOneBy({ email });
  }
}
