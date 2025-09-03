import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TimeEntriesService } from '../time-entries/time-entries.service';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@Controller('/reports')
export class ReportsController {
    constructor(
        private readonly timeEntryService: TimeEntriesService,
        private readonly reportsService: ReportsService
      ) {}
  
    @UseGuards(JwtAuthGuard)
    @Get('/time-entries')
    async timeEntries(@Res() res: Response): Promise<any>{
      const data = await this.timeEntryService.findAll()

      const buffer = await this.reportsService.gererateTimeEntriesReport(data)

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', 'attachment; filename=usuarios.xlsx');

      res.send(buffer);
    }
}
