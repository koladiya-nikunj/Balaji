// mongo/mongo.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, ResellerSchema } from './mongo.model';
import { MongoController } from './mongo.controller';
import { MongoService } from './mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Reseller', schema: ResellerSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'Client', schema: OrderSchema },

    ]),
  ],
  controllers: [MongoController],
  providers: [MongoService],
})
export class MongoModule {}