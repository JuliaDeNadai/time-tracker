import { Module } from '@nestjs/common';
import { TimeEntriesController } from './time-entries.controller';
import { TimeEntriesService } from './time-entries.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntrySchema } from './time-entries.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{
        name: 'TimeEntry', schema: TimeEntrySchema,
      }]),
    ],
  controllers: [TimeEntriesController],
  providers: [TimeEntriesService],
  exports: [TimeEntriesService]
})
export class TimeEntriesModule {}
