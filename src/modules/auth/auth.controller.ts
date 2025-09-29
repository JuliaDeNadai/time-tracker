import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('')
  @ApiOperation({
    summary: 'Autenticação',
    description: 'Retorna um token de acesso que pode ser adicionado no canto superior direito da página, no campo "Authorize", aplicando a autenticação a todas as requisições.',
  })  
  async signIn(@Body() login: SignInDto) {
    let user = await this.authService.validateUser(login.email, login.password)

    if(user) 
      return this.authService.login(user);

    throw new UnauthorizedException();
  }
}
