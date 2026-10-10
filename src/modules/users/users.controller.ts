import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from './users.service';
import { UserRole } from './users.schema';
import { CreateUserDto } from './Dtos/createUser.dto';
import { UpdateUserRoleDto } from './Dtos/updateUserRole.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
    constructor(
        private readonly userService: UsersService,
      ) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    @ApiOperation({
        summary: 'Usuários',
        description: 'Retorna dados de todos os usuários que você tem acesso.',
    })
    async getAll(@Req() req: any): Promise<any>{
        const userId = req?.decodedData?.userId
        return await this.userService.findAll({userId})
    }

    @UseGuards(JwtAuthGuard)
    @Post('')
    @ApiOperation({
        summary: 'Criar usuário',
        description: 'Criação de usuário para acesso a API. Todo usuário é criado com o perfil general.',
    })
    async create(@Body() user: CreateUserDto): Promise<any>{

        let findUser = await this.userService.findOne(user.email)
        if(findUser) throw new HttpException('Email already in use', HttpStatus.CONFLICT);

        return await this.userService.create(user)
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id/role')
    @ApiOperation({
        summary: 'Alterar perfil de usuário',
        description: 'Altera o perfil (admin ou general) de um usuário. Disponível somente para admin, que não pode alterar o próprio perfil.',
    })
    async updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto, @Req() req: any): Promise<any>{
        if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Id de usuário inválido')

        const requesterId = req?.decodedData?.userId
        if (id === requesterId) throw new ForbiddenException('Admin não pode alterar o próprio perfil')

        const updated = await this.userService.updateRole(id, dto.role)
        if (!updated) throw new NotFoundException('Usuário não encontrado')

        return updated
    }
}
