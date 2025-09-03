import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, Document } from 'mongoose';
import { User } from '../users/users.schema';
import { Company } from '../companies/companies.schema';
import { Service } from '../services/services.schema';

@Schema({ timestamps: true, collection: 'time-entries' })

export class TimeEntry extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Companies', required: true })
  company: Company;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Services', required: true })
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

TimeEntrySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.createdAt = new Date(ret.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    ret.updatedAt = new Date(ret.updatedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    ret.clock_in = new Date(ret.clock_in).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    ret.clock_out = new Date(ret.clock_out).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    
    return ret;
  },
});