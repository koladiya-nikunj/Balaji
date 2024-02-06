//  src/resellerMysql/mysqlReseller.module.ts

import { Module } from '@nestjs/common';
import { MySqlResellerService } from './mysqlReseller.service';

@Module({
  providers: [MySqlResellerService],
  exports: [MySqlResellerService], // Ensure proper export
})
export class MySqlResellerModule {}
