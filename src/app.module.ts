import './config/load-env';

import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UsersController } from './modules/users/users.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { RolesGuard } from './modules/auth/roles.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesModule } from './modules/services/services.module';
import { ServicesController } from './modules/services/services.controller';
import { CompaniesModule } from './modules/companies/companies.module';
import { CompaniesController } from './modules/companies/companies.controller';
import { TimeEntriesModule } from './modules/time-entries/time-entries.module';
import { TimeEntriesController } from './modules/time-entries/time-entries.controller';
import { ReportsModule } from './modules/reports/reports.module';
import { ReportsController } from './modules/reports/reports.controller';

const mongoUrl = process.env.MONGO_URL
if (!mongoUrl) {
  throw new Error('MONGO_URL não definido. Use npm run start:dev (banco dev) ou npm run start:dev:prod-db (banco prod).')
}

@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl),
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
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
