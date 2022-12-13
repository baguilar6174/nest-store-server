import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

import { RawHeaders } from '../../common/decorators';
import { AuthService } from './auth.service';
import { GetUser } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signin(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.signin(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testPrivateRoute(
    // @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }
}
