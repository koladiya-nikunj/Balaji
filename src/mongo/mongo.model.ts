// mongo/mongo.model.ts

import { Schema, model } from 'mongoose';

export const ResellerSchema = new Schema({
  name: String,
  email: String,
  address: String,
});

export const OrderSchema = new Schema({
  order_id: String,
  user_id: String,
  pickup_address_pincode: Number,
  shipment_length: Number,
  shipment_width: Number,
  shipment_height: Number,
  weight: Number,
  amount: Number,
  invoice_order: String,
  provider_label: String,
});

export const ClientSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  address: String,
});


export const ResellerModel = model('Reseller', ResellerSchema);
export const OrderModel = model('Order', OrderSchema);
export const ClientModel = model('CLient', ClientSchema);
