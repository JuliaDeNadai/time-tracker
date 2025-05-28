import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('')
  //@UseGuards(LocalAuthGuard)
  async signIn(@Body() signInDto: Record<string, any>) {

    //return signInDto
    let user = await this.authService.validateUser(signInDto.username, signInDto.password)

    if(user) 
      return this.authService.login(user);

    throw new UnauthorizedException();
  }
}
