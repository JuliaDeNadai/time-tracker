import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { CreateUserDto } from './Dtos/createUser.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
    constructor(
        private readonly userService: UsersService,
      ) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getAll(@Req() req: any): Promise<any>{
        const userId = req?.decodedData?.userId
        return await this.userService.findAll({userId})
    }

    @UseGuards(JwtAuthGuard)
    @Post('')
    async create(@Body() user: CreateUserDto): Promise<any>{

        let findUser = await this.userService.findOne(user.email)
        if(findUser) throw new HttpException('Email already in use', HttpStatus.CONFLICT);

        return await this.userService.create(user)
    }
}
