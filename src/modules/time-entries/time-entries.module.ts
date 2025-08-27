import { Module } from '@nestjs/common';
import { TimeEntriesController } from './time-entries.controller';
import { TimeEntriesService } from './time-entries.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntry } from './time-entries.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{
        name: 'Services', schema: TimeEntry,
      }]),
    ],
  controllers: [TimeEntriesController],
  providers: [TimeEntriesService],
  exports: [TimeEntriesService]
})
export class TimeEntriesModule {}
