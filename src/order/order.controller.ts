// order.controller.ts

import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { Order } from './order.model';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Post()
  createOrder(@Body() orderDto: OrderDto): Promise<Order> {
    return this.orderService.postOrder(orderDto);
  }
}
