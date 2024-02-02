//  src/mysqlUser/mysqlUser.module.ts
import { Module } from '@nestjs/common';
import { MySqlUserService } from './mysqlUser.service';

@Module({
  providers: [MySqlUserService],
  exports: [MySqlUserService], // Ensure proper export
})
export class MySqlUserModule {}
