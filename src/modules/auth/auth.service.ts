import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hash = await this.hashPassword(password);
    const user: User = this.userRepository.create({
      ...rest,
      password: hash,
    });
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(loginUserDto: LoginUserDto): Promise<User> {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true },
    });
    if (!user) throw new UnauthorizedException(`Credentials are not valid`);
    const isValidPassword = await this.checkPassword(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException(`Credentials are not valid`);
    }
    // TODO: include JWT
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }
}
