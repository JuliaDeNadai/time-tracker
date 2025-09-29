import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCompanyDTO } from './dto/create-company.dto';

@Controller('companies')
@ApiTags('Companies')
@ApiBearerAuth()
export class CompaniesController {
    constructor(
        private readonly companyService: CompanyService,
      ) {}
  
    @UseGuards(JwtAuthGuard)
    @Get('')
    @ApiOperation({
      summary: 'Empresas contratantes',
      description: 'Retorna todas as empresas contratante cadastradas pelo usuário.',
    })
    async getAll(@Req() req: any): Promise<any>{
      const userId = req?.decodedData?.userId
      return await this.companyService.findAll({userId})
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('')
    @ApiOperation({
      summary: 'Cadastro de empresas contratantes',
      description: 'Cadastra uma nova empresa que contratará os serviços.',
    })
    async create(@Body() body: CreateCompanyDTO, @Req() req: any): Promise<any>{
      const { name } = body
      const user = req?.decodedData?.userId
      return await this.companyService.create({name, user})
    }

    @Delete(':id')
    @ApiOperation({
      summary: 'Empresas contratantes',
      description: 'Excluir uma empresa contratante.',
    })
    remove(@Param('id') id: string) {
      return this.companyService.remove(id);
    }
}
