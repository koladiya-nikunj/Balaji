// order.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderModel } from './order.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderModel }])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
