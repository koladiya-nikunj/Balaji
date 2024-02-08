// src/order/Order.model.ts

import { Document } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  order_id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  pickup_address_pincode: number;

  @Prop({ required:true })
  shipment_length: number;
  
  @Prop({ required:true })
  shipment_width: number;
  
  @Prop({ required:true })
  shipment_height: number;
  
  @Prop({ required:true })
  weight: number;

  @Prop({ required:true })
  amount: number;

  @Prop({ required:true })
  invoice_order: string;

  @Prop({ required:true })
  provider_label: string;

  @Prop({ default: () => new Date() }) // Use a function to get the current date and time
  created_date: string;

  @Prop({ default: true })
  isValidate: boolean;
}

export const UserModel = SchemaFactory.createForClass(Order);