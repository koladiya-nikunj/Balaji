// distributor.model.ts

import { Document, Schema, model } from 'mongoose';

export interface Distributor extends Document {
  email: string;
  sales_id: string;
  total_onboarded_reseller: number;
  created_date: Date;
  isValidate: boolean;
}

const distributorSchema = new Schema<Distributor>({
  email: { type: String, required: true },
  sales_id: { type: String, required: true },
  total_onboarded_reseller: { type: Number, required: true },
  created_date: { type: Date, required: true },
  isValidate: { type: Boolean, default: true },
});

export const DistributorModel = model<Distributor>('Distributor', distributorSchema);
