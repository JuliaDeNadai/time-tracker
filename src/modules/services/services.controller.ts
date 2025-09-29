import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ServicesService } from './services.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateServiceDTO } from './dto/create-service.dto';

@Controller('services')
@ApiTags('Services')
@ApiBearerAuth()
export class ServicesController {
    constructor(
      private readonly serviceService: ServicesService,
    ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOperation({
    summary: 'Serviços oferecidos',
    description: 'Retorna todos os serviços oferecidos pelo usuário.',
  })
  async getAll(@Req() req: any): Promise<any>{
    const userId = req?.decodedData?.userId
    return await this.serviceService.findAll({userId})
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  @ApiOperation({
    summary: 'Serviços oferecidos',
    description: 'Cadastra um novo serviço que pode ser contratado.',
  })
  async create(@Body() body: CreateServiceDTO, @Req() req: any): Promise<any>{
    const { name } = body
    const user = req?.decodedData?.userId
    return await this.serviceService.create({name, user})
  }

}
