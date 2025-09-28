import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company } from './companies.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

interface FilterOptions {
  userId: string;
}

@Injectable()
export class CompanyService {
    constructor(
        @InjectModel('Companies') private readonly companyModel: Model<Company>,
    ) {}
    
    async findOne(name: string): Promise<Company | null> {
        const company = await this.companyModel.findOne({ name }).exec()
        return company
    }

    async findAll(filters: FilterOptions): Promise<Company[]> {
        const query = { user: new Types.ObjectId(filters.userId) }
        return await this.companyModel.find(query).exec()
    }

    async create(company: { name: string, user: string }){
        let newCompany = new this.companyModel(company)
        return newCompany.save()
    }

    async remove(id: string){
        const filter  = { _id: id };

        const deleted = await this.companyModel.deleteOne(filter);
        return deleted;
    }
}
