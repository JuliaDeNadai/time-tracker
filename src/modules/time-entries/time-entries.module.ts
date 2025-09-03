import { Module } from '@nestjs/common';
import { TimeEntriesController } from './time-entries.controller';
import { TimeEntriesService } from './time-entries.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntrySchema } from './time-entries.schema';
import { UserSchema } from '../users/users.schema';
import { CompanySchema } from '../companies/companies.schema';
import { ServiceSchema } from '../services/services.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'TimeEntry', schema: TimeEntrySchema },
        { name: 'User', schema: UserSchema },
        { name: 'Companies', schema: CompanySchema },
        { name: 'Services', schema: ServiceSchema }
      ]),
    ],
  controllers: [TimeEntriesController],
  providers: [TimeEntriesService],
  exports: [TimeEntriesService]
})
export class TimeEntriesModule {}
