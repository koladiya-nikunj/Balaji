// src/distributor/distributor.module.ts

import { Module } from '@nestjs/common';
import { DistributorController } from './distributor.controller';
import { DistributorService } from './distributor.service';
import { Distributor, DistributorModel } from './distributor.model';
import { MongooseModule } from '@nestjs/mongoose';
import { mysqlDistributorService } from 'src/distributor/mysql/mysqlDistributor.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Distributor.name, schema: DistributorModel }])],
  controllers: [DistributorController],
  providers: [DistributorService,mysqlDistributorService],
})
export class DistributorModule { }
