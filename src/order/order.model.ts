// order.model.ts

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

@Schema()
export class Order {
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  invoice: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  label: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  pincode: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  height: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  length: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export const OrderModel = SchemaFactory.createForClass(Order);
