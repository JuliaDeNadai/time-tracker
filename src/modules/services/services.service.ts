import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv'; 
import { Service } from './services.schema';


@Injectable()
export class ServicesService {
  constructor(
    @InjectModel('Services') private readonly serviceModel: Model<Service>,
  ) {}
    
  async findOne(name: string): Promise<Service | null> {
    const user = await this.serviceModel.findOne({ name }).exec()
    return user
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceModel.find().exec()
  }

  async create(name: string){
    let newService = new this.serviceModel(name)
    return newService.save()
  }
    
    
}