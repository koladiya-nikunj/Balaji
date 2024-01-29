// sales-channel.module.ts
import { Module } from '@nestjs/common';
import { SalesChannelController } from './sales-channel.controller';
import { SalesChannelService } from './sales-channel.service';
import { Client, ClientModel } from './sales-channel.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientModel }])],
  controllers: [SalesChannelController],
  providers: [SalesChannelService],
})
export class SalesChannelModule { }
