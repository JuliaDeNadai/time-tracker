import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
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

        let findUser = await this.userService.findOne(user.email)
        if(findUser) throw new HttpException('Email already in use', HttpStatus.CONFLICT);

        return await this.userService.create(user)
    }
}
