import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import { CreateUserDto } from './Dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv'; 


@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<User>,
  ) {}
    
  async findOne(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec()
    return user
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec()
  }

  async create(user: CreateUserDto){
    const salt = process.env.SALT_OF_ROUNDS || ''
    user.password = await bcrypt.hash(user.password, parseInt(salt) ) || 'random'
    let newUser = new this.userModel(user)

    return newUser.save()
  }
    
    
}
