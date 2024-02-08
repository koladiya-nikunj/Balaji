// mongo/mongo.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema,  } from './mongo.model';
import { MongoController } from './mongo.controller';
import { MongoService } from './mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },

    ]),
  ],
  controllers: [MongoController],
  providers: [MongoService],
})
export class MongoModule {}