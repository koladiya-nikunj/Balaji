// order.dto.ts

import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class OrderDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  invoice: string;

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsNumber()
  pin: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsString()
  height: number;

  @IsNotEmpty()
  @IsString()
  length: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
