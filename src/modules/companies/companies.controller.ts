import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('companies')
export class CompaniesController {
    constructor(
        private readonly companyService: CompanyService,
      ) {}
  
    @UseGuards(JwtAuthGuard)
    @Get('')
    async getAll(@Req() req: any): Promise<any>{
      const userId = req?.decodedData?.userId
      return await this.companyService.findAll({userId})
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('')
    async create(@Body() name: string, @Req() req: any): Promise<any>{
      const user = req?.decodedData?.userId
      return await this.companyService.create({name, user})
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.companyService.remove(id);
    }
}
