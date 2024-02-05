//  src/mysqlUser/mysqlUser.module.ts
import { Module } from '@nestjs/common';
import { MySqlOrderService } from './mysqlOrder.service';

@Module({
  providers: [MySqlOrderService],
  exports: [MySqlOrderService], // Ensure proper export
})
export class MySqlOrderModule {}
