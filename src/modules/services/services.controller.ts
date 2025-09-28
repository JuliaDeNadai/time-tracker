import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
    constructor(
      private readonly serviceService: ServicesService,
    ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAll(@Req() req: any): Promise<any>{
    const userId = req?.decodedData?.userId
    return await this.serviceService.findAll({userId})
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() body: { name: string}, @Req() req: any): Promise<any>{
    const { name } = body
    const user = req?.decodedData?.userId
    return await this.serviceService.create({name, user})
  }

}
