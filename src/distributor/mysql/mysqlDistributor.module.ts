//  src/distributor/mysql/mysqlDistributor.module.ts

import { Module } from '@nestjs/common';
import { MysqlDistributorService } from './mysqlDistributor.service';

@Module({
  providers: [MysqlDistributorService],
  exports: [MysqlDistributorService], // Ensure proper export
})
export class MySqlDistributorModule {}
