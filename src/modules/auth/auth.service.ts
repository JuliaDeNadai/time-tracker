import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if(user == null) return null

    const validPass = await bcrypt.compare(pass, user.password)
    
    if (validPass) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  validateToken(token: string) {
    return this.jwtService.verify(token, {
        secret : process.env.JWT_SECRET_KEY
    });
  } 

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
