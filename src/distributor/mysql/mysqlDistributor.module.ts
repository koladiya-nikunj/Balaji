//  src/distributor/mysql/mysqlDistributor.module.ts

import { Module } from '@nestjs/common';
import { mysqlDistributorService } from './mysqlDistributor.service';

@Module({
  providers: [mysqlDistributorService],
  exports: [mysqlDistributorService], // Ensure proper export
})
export class MySqlDistributorModule {}
