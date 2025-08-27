import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimeEntry } from './time-entries.schema';


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

  /* async create(name: string){
    let newService = new this.serviceModel(name)
    return newService.save()
  } */
    
    
}