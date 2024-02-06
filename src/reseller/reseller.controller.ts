// src/reseller/reseller.controller.ts

import { BadRequestException, Body, Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ResellerService } from './reseller.service';
import { Reseller } from './reseller.model';

@Controller('reseller')
export class ResellerController {
  private lastRequestTimestamps: { [key: string]: number } = {};
  constructor(private readonly resellerService: ResellerService) { }

  @Get()
  async findRecentReseller(
    @Query('time', ParseIntPipe) time: number,
    @Query('onboarded_by') onboardedBy?: string,
  ): Promise<{ data: Reseller[] | string } | { error: { message: string; statusCode: number } }> {
    if (!onboardedBy) {
      // Handle the case where 'onboarded_by' is not provided in the query params
      throw new BadRequestException('The onboarded_by parameter is required.');
    }

    const lastRequestTimestamp = this.lastRequestTimestamps[onboardedBy];
    
    try {
      let resellerData: Reseller[] | string;
      if (!lastRequestTimestamp) {
        // First request, get all data
        resellerData = await this.resellerService.getDataFromMySQLToMongo(time, onboardedBy);
        // Save the timestamp for subsequent requests
        this.lastRequestTimestamps[onboardedBy] = Date.now();
      } else {
        // Subsequent requests, get data since last request
        resellerData = await this.resellerService.getDataSinceLastRequest(onboardedBy, lastRequestTimestamp);
        // Update the timestamp for subsequent requests
        this.lastRequestTimestamps[onboardedBy] = Date.now();
      }

      if (Array.isArray(resellerData) && resellerData.length === 0) {
        // No new data found
        console.log(`No new data found for last ${time} minutes`);
        throw new BadRequestException(`No new data found for last ${time} minutes`);
      } else {
        // Data found or error occurred
        return { data: resellerData };
      }
    } catch (error) {
      console.error(error.message);
      // Return a meaningful error response
      throw new BadRequestException(error.message);
    }
  }
}
