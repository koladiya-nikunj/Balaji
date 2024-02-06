// src/distributor/distributor.controller.ts

import { Body, Controller, Get, HttpStatus, Query  } from '@nestjs/common';
import { DistributorService } from './distributor.service';

@Controller('distributor')
export class DistributorController {
  constructor(private readonly distributorService: DistributorService) {}

  @Get()
  async getApi(@Query('sales_id') sales_id: string) {
    try {
      if (!sales_id) {
        throw new Error('sales_id must not be empty in the request parameters');
      }
      // Check if sales_id is a string
      if (typeof sales_id !== 'string') {
        throw new Error('sales_id must be a string in the request parameters');
      }
      const userData = await this.distributorService.getDataFromMySQLToMongo(sales_id);

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
