// mongo/mongo.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DistributorSchema, OrderSchema, ResellerModel, ResellerSchema } from './mongo.model';
import { MongoController } from './mongo.controller';
import { MongoService } from './mongo.service';
import { DistributorModel, OrderModel } from './mongo.model'; // Import DistributorModel and OrderModel

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Distributor', schema: DistributorSchema },
      { name: 'Reseller', schema: ResellerSchema },
      { name: 'Order', schema: OrderSchema },
    ]),
  ],
  controllers: [MongoController],
  providers: [MongoService],
})
export class MongoModule {}