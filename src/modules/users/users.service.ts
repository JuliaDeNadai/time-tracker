import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import { CreateUserDto } from './Dtos/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<User>,
  ) {}
    
  async findOne(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec()
    return user
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec()
  }

  async create(user: CreateUserDto){
    let newUser = new this.userModel(user)
    return newUser.save()
  }
    
    
}
