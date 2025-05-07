import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UsersService } from './modules/users/users.service';
import { UsersController } from './modules/users/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './modules/auth/constants';
import { AuthService } from './modules/auth/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    AuthModule
  ],
  controllers: [UsersController],
  providers: [ 
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
