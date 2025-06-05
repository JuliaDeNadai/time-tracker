import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { CreateUserDto } from './Dtos/createUser.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
      ) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getAll(): Promise<any>{
        return await this.userService.findAll()
    }

    @UseGuards(JwtAuthGuard)
    @Post('')
    async create(@Body() user: CreateUserDto): Promise<any>{
        return await this.userService.create(user)
    }
}
