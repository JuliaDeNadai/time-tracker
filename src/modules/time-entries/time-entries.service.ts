import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now, Types } from 'mongoose';
import { TimeEntry } from './time-entries.schema';
import { CreateTimeEntryDTO } from './dto/create-time-entry.dto';
import { startOfMonth, endOfMonth } from 'date-fns';

interface FilterOptions {
  userId: string;
  year?: number;
  month?: number;
  companyId?: string;
}

@Injectable()
export class TimeEntriesService {
  constructor(
    @InjectModel('TimeEntry') private readonly serviceModel: Model<TimeEntry>,
  ) {}
    
  /* async findOne(name: string): Promise<TimeEntry | null> {
    const user = await this.serviceModel.findOne({ name }).exec()
    return user
  } */

  getQueryByFilters(filters: FilterOptions){
    const query: any = { user: new Types.ObjectId(filters.userId) }

    if(filters.year && filters.month){
      const start = startOfMonth(new Date(filters.year, filters.month - 1, 1));
      const end = endOfMonth(new Date(filters.year, filters.month - 1, 1));

      query.clock_in = { $gte: start, $lte: end };
      query.clock_out = { $gte: start, $lte: end };
    }

    if (filters.companyId) {
      query.company = new Types.ObjectId(filters.companyId);
    }

    return query
  }

  async findAll(filters: FilterOptions): Promise<TimeEntry[]> {

    const query = this.getQueryByFilters(filters)

    return await this.serviceModel
      .find(query)
      .populate('user', 'name email value_hour')
      .populate('service', 'name')  
      .populate('company', 'name')
      .sort({ company: 1, 'clock_in': 1 })
      .exec()
  }

  async create(timeEntry: CreateTimeEntryDTO){
    let newTimeEntry = new this.serviceModel(timeEntry)
    return newTimeEntry.save()
  }

  async closeJourney(timeEntryId: string){
    const existingEntry = await this.serviceModel.findById(timeEntryId).populate('user');

    if (!existingEntry) {
      throw new NotFoundException('Prestação de serviço não encontrada.');
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
        total_amount: existingEntry.user.value_hour * roundedTotalHours,
        active: false
      },
      { new: true },
    );

    return updatedEntry;
  }
    
    
}