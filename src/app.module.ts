require('dotenv').config()

import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UsersController } from './modules/users/users.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesModule } from './modules/services/services.module';
import { ServicesController } from './modules/services/services.controller';
import { CompaniesModule } from './modules/companies/companies.module';
import { CompaniesController } from './modules/companies/companies.controller';
import { TimeEntriesModule } from './modules/time-entries/time-entries.module';
import { TimeEntriesController } from './modules/time-entries/time-entries.controller';
import { ReportsModule } from './modules/reports/reports.module';
import { ReportsController } from './modules/reports/reports.controller';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://url:1234' ),
    UsersModule,
    AuthModule,
    ServicesModule,
    CompaniesModule,
    TimeEntriesModule,
    ReportsModule
  ],
  controllers: [UsersController, ServicesController, CompaniesController, TimeEntriesController, ReportsController],
  providers: [ 
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
