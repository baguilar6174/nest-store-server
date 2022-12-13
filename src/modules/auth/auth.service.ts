import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JWTPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const hash = await this.hashPassword(password);
    const user: User = this.userRepository.create({
      ...rest,
      password: hash,
    });
    await this.userRepository.save(user);
    delete user.password;
    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  async signin(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!user) throw new UnauthorizedException(`Credentials are not valid`);
    const isValidPassword = await this.checkPassword(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException(`Credentials are not valid`);
    }
    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async checkPassword(
    password: string,
    passwordDB: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }

  private getJwtToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload);
  }
}
