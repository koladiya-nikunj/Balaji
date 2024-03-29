// src/order/order.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, UserModel } from './order.model';
import { MySqlOrderModule } from './orderMysql/mysqlOrder.module';

@Module({
  imports: [MySqlOrderModule,
    MongooseModule.forFeature([{ name: Order.name, schema: UserModel }]),
  ],
  controllers: [OrderController],
  providers: [OrderService,MySqlOrderModule],
})
export class OrderModule {}
