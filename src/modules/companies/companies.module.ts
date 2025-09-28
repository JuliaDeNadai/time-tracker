import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesController } from './companies.controller';
import { CompanySchema } from './companies.schema';
import { CompanyService } from './company.service';
import { UserSchema } from '../users/users.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
          { name: 'Companies', schema: CompanySchema },
          { name: 'User', schema: UserSchema }
      ]),
      ],
      controllers: [CompaniesController],
      providers: [CompanyService],
      exports: [CompanyService]
})
export class CompaniesModule {}
