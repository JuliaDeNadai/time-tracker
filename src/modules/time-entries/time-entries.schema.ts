import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, Document } from 'mongoose';
import { User } from '../users/users.schema';
import { Company } from '../companies/companies.schema';
import { Service } from '../services/services.schema';

@Schema({ timestamps: true, collection: 'time-entries' })

export class TimeEntry extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true })
  company: Company;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true })
  service: Service;

  @Prop()
  date: string;

  @Prop({ type: Date, required: true, default: now() })
  clock_in: Date;

  @Prop({ type: Date, required: false, default: null })
  clock_out: string;

  @Prop({ default: null })
  total_hours: string;

  @Prop({ default: null })
  total_amount: string;

  @Prop({ default: null })
  details: string;

  @Prop({ default: true })
  active: boolean;
}

export const TimeEntrySchema = SchemaFactory.createForClass(TimeEntry);

TimeEntrySchema.index(
  { user: 1, company: 1, service: 1, active: 1 },
  { 
    unique: true,
    partialFilterExpression: { active: true }
  },
);