import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('')
  async signIn(@Body() login: SignInDto) {
    let user = await this.authService.validateUser(login.email, login.password)

    if(user) 
      return this.authService.login(user);

    throw new UnauthorizedException();
  }
}
