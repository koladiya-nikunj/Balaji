// src/data/data.module.ts

import { Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';
import { DistributorModule } from 'src/distributor/distributor.module';
import { ResellerModule } from 'src/reseller/order.module';
import { DataController } from './data.controller';

@Module({
    imports: [OrderModule, DistributorModule, ResellerModule],
    controllers: [DataController],
})
export class DataModule {}
