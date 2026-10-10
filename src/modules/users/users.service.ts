import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserRole } from './users.schema';
import { CreateUserDto } from './Dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv'; 

interface FilterOptions {
  userId: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<User>,
  ) {}
    
  async findOne(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec()
    return user
  }

  async findById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) return null
    return await this.userModel.findById(id, 'name email value_hour role').exec()
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.findById(userId)
    return user?.role === UserRole.ADMIN
  }

  async findAll(filters: FilterOptions, includeValues: boolean): Promise<User[]> {
    const query = { _id: new Types.ObjectId(filters.userId) }
    const projection = includeValues ? 'name email value_hour role' : 'name email role'
    return await this.userModel.find(query, projection).exec()
  }

  async create(user: CreateUserDto){
    const salt = process.env.SALT_OF_ROUNDS || ''
    user.password = await bcrypt.hash(user.password, parseInt(salt) ) || 'random'

    let newUser = new this.userModel({ ...user, role: UserRole.GENERAL })
    const saved = await newUser.save()
    return { _id: saved._id, name: saved.name, email: saved.email, role: saved.role }
  }

  async updateRole(id: string, role: UserRole): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(id, { role }, { new: true, projection: 'name email value_hour role' })
      .exec()
  }
    
}
