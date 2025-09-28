import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../users/users.schema';

@Schema()
export class Company extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop()
  name: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.index(
  { user: 1, company: 1 },
  { 
    unique: true,
    partialFilterExpression: { active: true }
  },
);