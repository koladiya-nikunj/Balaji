// mongo /mongo.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DistributorService } from './mongo.service';
import { DistributorModel } from 'src/distributor/distributor.model';
import { DistributorModule } from 'src/distributor/distributor.module';
import { MongoController } from './mongo.controller';

@Module({
  imports: [DistributorModule,
    MongooseModule.forFeature([{ name: 'Distributor', schema: DistributorModel }])],
  controllers: [MongoController],
  providers: [DistributorService],
  exports:[DistributorService]
})
export class MongoModule {}
