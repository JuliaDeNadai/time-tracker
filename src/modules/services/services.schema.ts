import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Service extends Document {
  @Prop()
  name: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);