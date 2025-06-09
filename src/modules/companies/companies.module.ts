import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesController } from './companies.controller';
import { CompanySchema } from './companies.schema';
import { CompanyService } from './company.service';

@Module({
    imports: [
        MongooseModule.forFeature([{
          name: 'Companies', schema: CompanySchema,
        }]),
      ],
      controllers: [CompaniesController],
      providers: [CompanyService],
      exports: [CompanyService]
})
export class CompaniesModule {}
