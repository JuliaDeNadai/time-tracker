import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDTO } from './dto/create-time-entry.dto';
import { GetTimeEntryDTO } from './dto/get-time-entry.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('time-entries/')
@ApiTags('Time Entries')
@ApiBearerAuth()
export class TimeEntriesController {
    constructor(
      private readonly timeEntriesService: TimeEntriesService,
    ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOperation({
    summary: 'Jornadas de trabalho',
    description: 'Retorna todas as entradas de jornada de trabalho do usuário com base nos filtros aplicados.',
  })
  async getAll(
    @Query() filters: GetTimeEntryDTO,
    @Req() req: any
  ): Promise<any>{
    const userId = req?.decodedData?.userId
    return await this.timeEntriesService.findAll({...filters, userId})
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  @ApiOperation({
    summary: 'Início de jornada de trabalho',
    description: 'Cadastra um novo registro de jornada de trabalho. Nesta rota é necessário fornecer os ids do serviço e da empresa contratante.',
  })
  async create(@Body() timeEntry: CreateTimeEntryDTO, @Req() req: any): Promise<any>{
    const user = req?.decodedData?.userId
    return await this.timeEntriesService.create({...timeEntry, user})
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Encerramento da jornada de trabalho',
    description: 'Encera uma jornada de trabalho em aberto, automaticamente realiza o cálculo de horas e valor total do serviço. Necessário fornecer o id da jornada de trabalho em aberto',
  })
  closeJourney(@Param('id') id: string) {
    return this.timeEntriesService.closeJourney(id);
  }

}