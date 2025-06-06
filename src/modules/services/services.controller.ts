import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
    constructor(
      private readonly serviceService: ServicesService,
    ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAll(): Promise<any>{
    return await this.serviceService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() name: string): Promise<any>{
    return await this.serviceService.create(name)
  }

}
