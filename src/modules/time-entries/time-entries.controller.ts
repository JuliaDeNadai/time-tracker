import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TimeEntriesService } from './time-entries.service';

@Controller('time-entries')
export class TimeEntriesController {
    constructor(
      private readonly timeEntriesService: TimeEntriesService,
    ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAll(): Promise<any>{
    return await this.timeEntriesService.findAll()
  }

  /* @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() name: string): Promise<any>{
    return await this.timeEntriesService.create(name)
  } */

}