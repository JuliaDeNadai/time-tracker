import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {

    @UseGuards(JwtAuthGuard)
    @Get('')
    getAll(){
        return []
    }
}
