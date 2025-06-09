import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('companies')
export class CompaniesController {
    constructor(
        private readonly companyService: CompanyService,
      ) {}
  
    @UseGuards(JwtAuthGuard)
    @Get('')
    async getAll(): Promise<any>{
      return await this.companyService.findAll()
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('')
    async create(@Body() name: string): Promise<any>{
      return await this.companyService.create(name)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.companyService.remove(id);
    }
}
