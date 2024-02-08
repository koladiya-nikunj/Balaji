// src/order/orderDto/order.dto.ts

export class OrderDto {
  order_id: string;
  user_id: string;
  pickup_address_pincode: number;
  shipment_length: number;
  shipment_width: number;
  shipment_height: number;
  weight: number;
  amount: number
  invoice_order: string;
  provider_label: string;
  created_date:string;
} 