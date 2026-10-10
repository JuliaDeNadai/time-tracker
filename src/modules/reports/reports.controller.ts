import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TimeEntriesService } from '../time-entries/time-entries.service';
import { UsersService } from '../users/users.service';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { GetReportDTO } from './dto/get-report.dto';
import { TimeEntry } from '../time-entries/time-entries.schema';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('/reports')
@ApiBearerAuth()
export class ReportsController {
    constructor(
        private readonly timeEntryService: TimeEntriesService,
        private readonly reportsService: ReportsService,
        private readonly usersService: UsersService
      ) {}
  
    @UseGuards(JwtAuthGuard)
    @Get('/time-entries')
    @ApiOperation({
      summary: 'Exporta relatório de lançamentos de horas',
      description:
        'Gera um relatório em formato Excel (.xlsx) contendo as entradas de tempo com base nos filtros aplicados. Usuários general geram somente o próprio relatório, sem a coluna "Valor Total". Admin pode informar userId de um usuário general.',
    })
    async timeEntries(
      @Query() filters: GetReportDTO,
      @Req() req: any,
      @Res() res: Response
    ): Promise<any>{

      const { userId: requestedUserId, ...timeFilters } = filters
      const { target, isAdmin } = await this.usersService.resolveTarget(req?.decodedData?.userId, requestedUserId)

      const data: TimeEntry[] = await this.timeEntryService.findAll({ ...timeFilters, userId: String(target._id) }, isAdmin)
 
      const buffer = await this.reportsService.generateTimeEntriesReport(data, {
        ...timeFilters,
        email: target.email,
        name: target.name,
        showValues: isAdmin,
      })

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ); 
      res.setHeader('Content-Disposition', `attachment; filename=relatorio-servicos-${filters.month}_${filters.year}.xlsx`);

      res.send(buffer);
    }
}
