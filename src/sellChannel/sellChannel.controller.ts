// sellChannel.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { SellChannelService } from './sellChannel.service';
import { sellDto } from './dto/sellDto';
import { Client } from './sellChannel.model';

@Controller('/sell-channel')
export class SellChannelController {
  constructor(private readonly sellChannelService: SellChannelService) { }

  @Get()
  async findAllApi(): Promise<Client[]> {
    return this.sellChannelService.findAll();
  }

  @Post()
  postApi(@Body() data: sellDto) {
    return this.sellChannelService.postData(data);
  }
}
