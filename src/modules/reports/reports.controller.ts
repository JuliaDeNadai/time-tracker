import { Controller, ForbiddenException, Get, NotFoundException, Query, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TimeEntriesService } from '../time-entries/time-entries.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/users.schema';
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

      const requesterId = req?.decodedData?.userId
      const requester = await this.usersService.findById(requesterId)
      if (!requester) throw new ForbiddenException('Usuário não encontrado')

      const isAdmin = requester.role === UserRole.ADMIN
      const { userId: requestedUserId, ...timeFilters } = filters
      const targetUserId = requestedUserId ?? requesterId

      let target = requester
      if (targetUserId !== requesterId) {
        if (!isAdmin) throw new ForbiddenException('Você só pode gerar relatórios para si mesmo')

        const targetUser = await this.usersService.findById(targetUserId)
        if (!targetUser) throw new NotFoundException('Usuário não encontrado')
        if (targetUser.role !== UserRole.GENERAL) {
          throw new ForbiddenException('Admin só pode gerar relatórios de usuários com perfil general')
        }
        target = targetUser
      }

      const data: TimeEntry[] = await this.timeEntryService.findAll({ ...timeFilters, userId: targetUserId })
 
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
