import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../users/users.schema';

@Schema()
export class Service extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop()
  name: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

ServiceSchema.index(
  { user: 1, service: 1 },
  { 
    unique: true,
    partialFilterExpression: { active: true }
  },
);