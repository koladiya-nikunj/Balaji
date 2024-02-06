// src/reseller/reseller.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResellerController } from './reseller.controller';
import { ResellerService } from './reseller.service';
import { Reseller, ResellerModel } from './reseller.model';
import { MySqlResellerModule } from './resellerMysql/mysqlReseller.module';

@Module({
  imports: [MySqlResellerModule,
    MongooseModule.forFeature([{ name: Reseller.name, schema:ResellerModel }]),
  ],
  controllers: [ResellerController],
  providers: [ResellerService,MySqlResellerModule],
  exports : []
})
export class ResellerModule {}
