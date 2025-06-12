import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './companies.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class CompanyService {
    constructor(
        @InjectModel('Companies') private readonly companyModel: Model<Company>,
    ) {}
    
    async findOne(name: string): Promise<Company | null> {
        const company = await this.companyModel.findOne({ name }).exec()
        return company
    }

    async findAll(): Promise<Company[]> {
        return await this.companyModel.find().exec()
    }

    async create(name: string){
        let newCompany = new this.companyModel(name)
        return newCompany.save()
    }

    async remove(id: string){
        const filter  = { _id: id };

        const deleted = await this.companyModel.deleteOne(filter);
        return deleted;
    }
}
