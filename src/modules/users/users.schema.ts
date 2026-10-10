import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  GENERAL = 'general',
}

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  value_hour: number;

  @Prop({ type: String, enum: UserRole, default: UserRole.GENERAL })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);