// src/distributor/distributor.module.ts

import { Module } from '@nestjs/common';
import { DistributorController } from './distributor.controller';
import { DistributorService } from './distributor.service';
import { Distributor, DistributorModel } from './distributor.model';
import { MongooseModule } from '@nestjs/mongoose';
import { MySqlDistributorModule } from './mysql/mysqlDistributor.module';

@Module({
  imports: [MySqlDistributorModule,
    MongooseModule.forFeature([{ name: Distributor.name, schema: DistributorModel }])],
  controllers: [DistributorController],
  providers: [DistributorService,MySqlDistributorModule],
  exports:[DistributorService]
})
export class DistributorModule { }
