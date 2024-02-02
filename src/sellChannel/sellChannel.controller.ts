// src/sellChannel/sellChannel.controller.ts
import { Body, Controller, Get, HttpStatus } from '@nestjs/common';
import { SellChannelService } from './sellChannel.service';

@Controller('sell-channel')
export class SellChannelController {
  constructor(private readonly sellChannelService: SellChannelService) {}

  @Get()
  async getApi(@Body() body: { sales_id: string }) {
    try {
      if (!body.sales_id) {
        throw new Error('salesId must not be empty in the request body');
      }
      // Check if sales_id is a string
      if (typeof body.sales_id !== 'string') {
        throw new Error('salesId must be a string in the request body');
      }
      const userData = await this.sellChannelService.getDataFromMySQLToMongo(body.sales_id);

      // Use userData to do further processing or return it in the response
      return userData;
    } catch (error) {
      console.error(error.message);
      // Return a meaningful error response
      return {
        error: {
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST, // Set the appropriate status code
        },
      };
    }
  }
}
