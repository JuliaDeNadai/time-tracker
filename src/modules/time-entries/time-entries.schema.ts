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

  @Prop({ type: Date, required: true, default: Date.now })
  clock_in: Date;

  @Prop({ type: Date, required: false, default: null })
  clock_out: Date;

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
    const formatDate = (date: any) =>
      date ? new Date(date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : null;

    ret.createdAt = formatDate(ret.createdAt);
    ret.updatedAt = formatDate(ret.updatedAt);
    ret.clock_in = formatDate(ret.clock_in);
    ret.clock_out = formatDate(ret.clock_out);

    if (ret.total_hours !== undefined && ret.total_hours !== null) {
      const totalHours = ret.total_hours;
      const hours = Math.floor(totalHours);
      const minutes = Math.floor((totalHours - hours) * 60);
      const pad = (n: number) => n.toString().padStart(2, '0');
      ret.total_hours = `${pad(hours)}:${pad(minutes)}`;
    }
    
    return ret;
  },
});