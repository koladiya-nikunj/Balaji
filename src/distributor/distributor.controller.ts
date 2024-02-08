// src/distributor/distributor.controller.ts

import { BadRequestException, Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { DistributorService } from './distributor.service';
import { Distributor } from './distributor.model';

@Controller('distributor')
export class DistributorController {
  private lastRequestTimestamps: { [key: string]: number } = {};
  constructor(private readonly usersService: DistributorService) { }

  @Get()
  async findRecentUsers(
    @Query('time', ParseIntPipe) time: number,
    @Query('sales_id') orderedBy?: string,
  ): Promise<{ data: Distributor[] | string } | { error: { message: string; statusCode: number } }> {
    if (!orderedBy) {
      // Handle the case where 'sales_id' is not provided in the query params
      throw new BadRequestException('The sales_id parameter is required.');
    }

    const lastRequestTimestamp = this.lastRequestTimestamps[orderedBy];
    
    try {
      let userData: Distributor[] | string;
      if (!lastRequestTimestamp) {
        // First request, get all data
        userData = await this.usersService.getDataFromMySQLToMongo(time, orderedBy);
        // Save the timestamp for subsequent requests
        this.lastRequestTimestamps[orderedBy] = Date.now();
      } else {
        // Subsequent requests, get data since last request
        userData = await this.usersService.getDataSinceLastRequest(orderedBy, lastRequestTimestamp);
        // Update the timestamp for subsequent requests
        this.lastRequestTimestamps[orderedBy] = Date.now();
      }

      if (Array.isArray(userData) && userData.length === 0) {
        // No new data found
        throw new BadRequestException(`No new data found for last ${time} minutes`);
      } else {
        // Data found or error occurred
        return { data: userData };
      }
    } catch (error) {
      console.error(error.message);
      // Return a meaningful error response
      throw new BadRequestException(error.message);
    }
  }
}
