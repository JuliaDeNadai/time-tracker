import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TimeEntry extends Document {
  @Prop()
  user: string;

  @Prop()
  company: string;

  @Prop()
  service: string;

  @Prop()
  date: string;

  @Prop()
  clock_in: string;

  @Prop()
  clock_oute: string;

  @Prop()
  total_hours: string;

  @Prop()
  total_amount: string;

  @Prop()
  details: string;
}

export const TimeEntriesSchema = SchemaFactory.createForClass(TimeEntry);