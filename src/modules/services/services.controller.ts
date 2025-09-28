import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ServicesService } from './services.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateServiceDTO } from './dto/create-service.dto';

@Controller('services')
@ApiBearerAuth()
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
  async create(@Body() body: CreateServiceDTO, @Req() req: any): Promise<any>{
    const { name } = body
    const user = req?.decodedData?.userId
    return await this.serviceService.create({name, user})
  }

}
