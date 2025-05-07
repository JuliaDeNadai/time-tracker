import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('')
  @UseGuards(LocalAuthGuard)
  signIn(@Body() signInDto: Record<string, any>) {
    let user = this.authService.validateUser(signInDto.username, signInDto.password)

    if(user) 
      return this.authService.login(user);

    return HttpStatus.BAD_REQUEST
  }
}
