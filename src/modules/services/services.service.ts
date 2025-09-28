import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv'; 
import { Service } from './services.schema';

interface FilterOptions {
  userId: string;
}

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel('Services') private readonly serviceModel: Model<Service>,
  ) {}
    
  async findOne(name: string): Promise<Service | null> {
    const user = await this.serviceModel.findOne({ name }).exec()
    return user
  }

  async findAll(filters: FilterOptions): Promise<Service[]> {
    const query = { user: new Types.ObjectId(filters.userId) }
    return await this.serviceModel.find(query).exec()
  }

  async create(service: { name: string, user: string }){
    let newService = new this.serviceModel(service)
    return newService.save()
  }
    
    
}