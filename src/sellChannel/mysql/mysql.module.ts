import { Module } from '@nestjs/common';
import { MySqlService } from './mysql.service';

@Module({
  providers: [MySqlService],
  exports: [MySqlService], // Ensure proper export
})
export class MySqlModule {}
