// src/sellChannel/sellChannel.controller.ts

import { Controller, Get } from '@nestjs/common';
import { SellChannelService } from './sellChannel.service';

@Controller('sell-channel')
export class SellChannelController {
  constructor(private readonly sellChannelService: SellChannelService) {}

  @Get()
  async getApi() {
    try {
      const salesId = "MRGJ24118"; // Replace this with your actual sales_id
      const userData = await this.sellChannelService.getDataFromMySQLToMongo(salesId);

      // Use userData to do further processing or return it in the response
      return userData;
    } catch (error) {
      console.error( error.message);
      // Handle the error appropriately (send an error response or log it)
      return { error: 'Error retrieving user data' };
    }
  }

}
