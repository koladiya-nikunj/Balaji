// mongo/mongo.model.ts

import { Schema, model } from 'mongoose';


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



export const OrderModel = model('Order', OrderSchema);
