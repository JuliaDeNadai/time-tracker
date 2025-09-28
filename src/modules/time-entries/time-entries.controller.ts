import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDTO } from './dto/create-time-entry.dto';
import { GetTimeEntryDTO } from './dto/get-time-entry.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('time-entries/')
@ApiBearerAuth()
export class TimeEntriesController {
    constructor(
      private readonly timeEntriesService: TimeEntriesService,
    ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAll(
    @Query() filters: GetTimeEntryDTO,
    @Req() req: any
  ): Promise<any>{
    const userId = req?.decodedData?.userId
    return await this.timeEntriesService.findAll({...filters, userId})
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() timeEntry: CreateTimeEntryDTO, @Req() req: any): Promise<any>{
    const user = req?.decodedData?.userId
    return await this.timeEntriesService.create({...timeEntry, user})
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  closeJourney(@Param('id') id: string) {
    return this.timeEntriesService.closeJourney(id);
  }

}