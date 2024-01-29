// sales-channel.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { SalesChannelService } from './sales-channel.service';
import { salesDto } from './dto/salesDto';
import { Client } from './sales-channel.model';

@Controller('/sales-channel')
export class SalesChannelController {
  constructor(private readonly salesChannelService: SalesChannelService) {}

  @Get()
  async findAllApi(): Promise<Client[]> {
    return this.salesChannelService.findAll();
  }

  @Post()
  postApi(@Body() data: salesDto) {
    return this.salesChannelService.postData(data);
  }
}
