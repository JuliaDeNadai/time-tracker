import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.schema';
import { UsersService } from '../users/users.service';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDTO } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDTO } from './dto/update-time-entry.dto';
import { GetTimeEntryDTO } from './dto/get-time-entry.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('time-entries/')
@ApiTags('Time Entries')
@ApiBearerAuth()
export class TimeEntriesController {
    constructor(
      private readonly timeEntriesService: TimeEntriesService,
      private readonly usersService: UsersService,
    ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOperation({
    summary: 'Jornadas de trabalho',
    description: 'Retorna todas as entradas de jornada de trabalho do usuário com base nos filtros aplicados. Valores em reais (valor/hora e valor total) só são retornados para admin.',
  })
  async getAll(
    @Query() filters: GetTimeEntryDTO,
    @Req() req: any
  ): Promise<any>{
    const userId = req?.decodedData?.userId
    const isAdmin = await this.usersService.isAdmin(userId)
    return await this.timeEntriesService.findAll({...filters, userId}, isAdmin)
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  @ApiOperation({
    summary: 'Início de jornada de trabalho',
    description: 'Cadastra um novo registro de jornada de trabalho. Nesta rota é necessário fornecer os ids do serviço e da empresa contratante.',
  })
  async create(@Body() timeEntry: CreateTimeEntryDTO, @Req() req: any): Promise<any>{
    const user = req?.decodedData?.userId
    const isAdmin = await this.usersService.isAdmin(user)
    return await this.timeEntriesService.create({...timeEntry, user}, isAdmin)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Encerramento da jornada de trabalho',
    description: 'Encera uma jornada de trabalho em aberto, automaticamente realiza o cálculo de horas e valor total do serviço. Necessário fornecer o id da jornada de trabalho em aberto. Somente o dono da jornada pode encerrá-la. O valor total só é retornado para admin.',
  })
  async closeJourney(@Param('id') id: string, @Req() req: any) {
    const userId = req?.decodedData?.userId
    const isAdmin = await this.usersService.isAdmin(userId)
    return this.timeEntriesService.closeJourney(id, userId, isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Alterar jornada de trabalho',
    description: 'Altera um registro de jornada de trabalho. Disponível somente para admin. Ao alterar início ou fim de uma jornada encerrada, horas e valor total são recalculados com o valor/hora do dono do registro.',
  })
  update(@Param('id') id: string, @Body() data: UpdateTimeEntryDTO) {
    return this.timeEntriesService.update(id, data);
  }

}
