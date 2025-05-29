import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('')
  async signIn(@Body() signInDto: Record<string, any>) {

    //return signInDto
    let user = await this.authService.validateUser(signInDto.username, signInDto.password)

    if(user) 
      return this.authService.login(user);

    throw new UnauthorizedException();
  }
}
