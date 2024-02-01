// sellChannel.module.ts
import { Module } from '@nestjs/common';
import { SellChannelController } from './sellChannel.controller';
import { SellChannelService } from './sellChannel.service';
import { Client, ClientModel } from './sellChannel.model';
import { MongooseModule } from '@nestjs/mongoose';
import { MySqlService } from 'src/mysql/mysql.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientModel }])],
  controllers: [SellChannelController],
  providers: [SellChannelService,MySqlService],
})
export class SellChannelModule { }
