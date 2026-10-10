import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now, Types } from 'mongoose';
import { TimeEntry } from './time-entries.schema';
import { CreateTimeEntryDTO } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDTO } from './dto/update-time-entry.dto';
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

  async create(timeEntry: CreateTimeEntryDTO & { user: string }){
    let newTimeEntry = new this.serviceModel(timeEntry)
    return newTimeEntry.save()
  }

  calculateTotals(clockIn: Date, clockOut: Date, valueHour: number) {
    const diffMs = clockOut.getTime() - clockIn.getTime();

    // Converte para horas (1 hora = 1000 * 60 * 60 ms)
    const totalHours = diffMs / (1000 * 60 * 60);
    const roundedTotalHours = parseFloat(totalHours.toFixed(2));

    return {
      total_hours: roundedTotalHours,
      total_amount: (Number(valueHour) || 0) * roundedTotalHours,
    };
  }

  async findEntryOrFail(timeEntryId: string) {
    if (!Types.ObjectId.isValid(timeEntryId)) {
      throw new BadRequestException('Id da jornada de trabalho inválido.');
    }

    const existingEntry = await this.serviceModel.findById(timeEntryId).populate('user');

    if (!existingEntry) {
      throw new NotFoundException('Prestação de serviço não encontrada.');
    }

    return existingEntry;
  }

  async closeJourney(timeEntryId: string, userId: string){
    const existingEntry = await this.findEntryOrFail(timeEntryId);

    if (existingEntry.user?._id?.toString() !== userId) {
      throw new ForbiddenException('Você só pode encerrar as suas próprias jornadas de trabalho.');
    }

    if (!existingEntry.active) {
      throw new ConflictException('Esta jornada de trabalho já foi encerrada.');
    }

    const now = new Date();

    const updatedEntry = await this.serviceModel.findByIdAndUpdate(
      timeEntryId,
      {
        clock_out: now,
        ...this.calculateTotals(existingEntry.clock_in, now, existingEntry.user.value_hour),
        active: false
      },
      { new: true },
    );

    return updatedEntry;
  }

  async update(timeEntryId: string, data: UpdateTimeEntryDTO){
    const existingEntry = await this.findEntryOrFail(timeEntryId);

    const update: any = {};

    if (data.company) update.company = new Types.ObjectId(data.company);
    if (data.service) update.service = new Types.ObjectId(data.service);
    if (data.details !== undefined) update.details = data.details;

    if (data.clock_in || data.clock_out) {
      const clockIn = data.clock_in ? new Date(data.clock_in) : existingEntry.clock_in;
      const clockOut = data.clock_out ? new Date(data.clock_out) : existingEntry.clock_out;

      if (data.clock_out && existingEntry.active) {
        throw new BadRequestException('Jornada em aberto: encerre a jornada antes de alterar o horário de término.');
      }

      if (clockOut && clockOut.getTime() < clockIn.getTime()) {
        throw new BadRequestException('O horário de término não pode ser anterior ao de início.');
      }

      update.clock_in = clockIn;

      if (clockOut) {
        update.clock_out = clockOut;
        Object.assign(update, this.calculateTotals(clockIn, clockOut, existingEntry.user.value_hour));
      }
    }

    return await this.serviceModel
      .findByIdAndUpdate(timeEntryId, update, { new: true })
      .populate('user', 'name email value_hour')
      .populate('service', 'name')
      .populate('company', 'name')
      .exec();
  }
    
    
}