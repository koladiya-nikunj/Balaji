// src/order/order.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { ResellerService } from './order.service';
import { Reseller, UserModel } from './order.model';
import { MySqlResellerModule } from './orderMysql/mysqlReseller.module';

@Module({
  imports: [MySqlResellerModule,
    MongooseModule.forFeature([{ name: Reseller.name, schema: UserModel }]),
  ],
  controllers: [OrderController],
  providers: [ResellerService,MySqlResellerModule],
})
export class ResellerModule {}
