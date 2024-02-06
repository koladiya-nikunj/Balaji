// scr/distributor/distributor.model.ts

import { Document, } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class Distributor extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  sales_id: string;

  @Prop({ required: true })
  total_onboarded_reseller: number;

  @Prop({ default: true })
  isValidate: boolean;
}

export const DistributorModel = SchemaFactory.createForClass(Distributor);
