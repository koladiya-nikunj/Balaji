// src/order/Order.model.ts

import { Document } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class Reseller extends Document {
  @Prop({ required: true })
  email: string;
 
  @Prop({ required: true })
  user_id: string;
 
  @Prop({ required: true })
  onboarded_by: string;

  @Prop({ default: true })
  isValidate: boolean;

  @Prop({ default: () => new Date() }) // Use a function to get the current date and time
  created_date: string;

}



export const UserModel = SchemaFactory.createForClass(Reseller);