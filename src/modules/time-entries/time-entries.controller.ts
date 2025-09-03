import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDTO } from './dto/create-time-entry.dto';

@Controller('time-entries/')
export class TimeEntriesController {
    constructor(
      private readonly timeEntriesService: TimeEntriesService,
    ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAll(): Promise<any>{
    return await this.timeEntriesService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() timeEntry: CreateTimeEntryDTO): Promise<any>{
    return await this.timeEntriesService.create(timeEntry)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  closeJourney(@Param('id') id: string) {
    return this.timeEntriesService.closeJourney(id);
  }

}