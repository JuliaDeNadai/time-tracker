import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntrySchema } from '../time-entries/time-entries.schema';
import { UserSchema } from '../users/users.schema';
import { CompanySchema } from '../companies/companies.schema';
import { ServiceSchema } from '../services/services.schema';
import { ReportsController } from './reports.controller';
import { TimeEntriesService } from '../time-entries/time-entries.service';
import { ReportsService } from './reports.service';


@Module({
    imports: [
        MongooseModule.forFeature([        
          { name: 'TimeEntry', schema: TimeEntrySchema },
          { name: 'User', schema: UserSchema },
          { name: 'Companies', schema: CompanySchema },
          { name: 'Services', schema: ServiceSchema }
        ]),
      ],
      controllers: [ReportsController],
      providers: [TimeEntriesService, ReportsService],
      exports: [ReportsService]
})
export class ReportsModule {}
