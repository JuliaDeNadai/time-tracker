import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TimeEntriesService } from '../time-entries/time-entries.service';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { GetTimeEntryDTO } from '../time-entries/dto/get-time-entry.dto';
import { TimeEntry } from '../time-entries/time-entries.schema';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('/reports')
@ApiBearerAuth()
export class ReportsController {
    constructor(
        private readonly timeEntryService: TimeEntriesService,
        private readonly reportsService: ReportsService
      ) {}
  
    @UseGuards(JwtAuthGuard)
    @Get('/time-entries')
    @ApiOperation({
      summary: 'Exporta relatório de lançamentos de horas',
      description:
        'Gera um relatório em formato Excel (.xlsx) contendo as entradas de tempo do usuário com base nos filtros aplicados.',
    })
    async timeEntries(
      @Query() filters: GetTimeEntryDTO,
      @Req() req: any,
      @Res() res: Response
    ): Promise<any>{

      const userId = req?.decodedData?.userId
      const email = req?.decodedData?.email

      const data: TimeEntry[] = await this.timeEntryService.findAll({...filters, userId})
 
      const buffer = await this.reportsService.generateTimeEntriesReport(data, { ...filters, email })

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ); 
      res.setHeader('Content-Disposition', `attachment; filename=relatorio-servicos-${filters.month}_${filters.year}.xlsx`);

      res.send(buffer);
    }
}
