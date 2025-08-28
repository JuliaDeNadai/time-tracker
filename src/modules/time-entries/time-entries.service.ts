import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { TimeEntry } from './time-entries.schema';
import { CreateTimeEntryDTO } from './dto/create-time-entry.dto';


@Injectable()
export class TimeEntriesService {
  constructor(
    @InjectModel('Services') private readonly serviceModel: Model<TimeEntry>,
  ) {}
    
  /* async findOne(name: string): Promise<TimeEntry | null> {
    const user = await this.serviceModel.findOne({ name }).exec()
    return user
  } */

  async findAll(): Promise<TimeEntry[]> {
    return await this.serviceModel.find().exec()
  }

  async create(timeEntry: CreateTimeEntryDTO){
    let newTimeEntry = new this.serviceModel(timeEntry)
    return newTimeEntry.save()
  }

  async closeJourney(timeEntryId: string){
    const existingEntry = await this.serviceModel.findById(timeEntryId);

    if (!existingEntry) {
      throw new NotFoundException('Time entry not found');
    }

    const now = new Date();
    const clockIn = existingEntry.clock_in;
    const diffMs = now.getTime() - clockIn.getTime();

    // Converte para horas (1 hora = 1000 * 60 * 60 ms)
    const totalHours = diffMs / (1000 * 60 * 60);
    const roundedTotalHours = parseFloat(totalHours.toFixed(2));

    const updatedEntry = await this.serviceModel.findByIdAndUpdate(
      timeEntryId,
      {
        clock_out: now,
        total_hours: roundedTotalHours,
        total_amount: existingEntry.user.value_hour * roundedTotalHours
      },
      { new: true },
    );

    return updatedEntry;
  }
    
    
}