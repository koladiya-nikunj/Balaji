// src/users/users.controller.ts
import { BadRequestException, Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto';
import { User } from './users.model';

@Controller('users')
export class UsersController {
  private lastRequestTimestamps: { [key: string]: number } = {};
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findRecentUsers(
    @Query('time', ParseIntPipe) time: number,
    @Query('onboarded_by') onboardedBy?: string,
  ): Promise<{ data: User[] | string } | { error: { message: string; statusCode: number } }> {
    if (!onboardedBy) {
      // Handle the case where 'onboarded_by' is not provided in the query params
      throw new BadRequestException('The onboarded_by parameter is required.');
    }

    const lastRequestTimestamp = this.lastRequestTimestamps[onboardedBy];
    
    try {
      let userData: User[] | string;
      if (!lastRequestTimestamp) {
        // First request, get all data
        userData = await this.usersService.getDataFromMySQLToMongo(time, onboardedBy);
        // Save the timestamp for subsequent requests
        this.lastRequestTimestamps[onboardedBy] = Date.now();
      } else {
        // Subsequent requests, get data since last request
        userData = await this.usersService.getDataSinceLastRequest(onboardedBy, lastRequestTimestamp);
        // Update the timestamp for subsequent requests
        this.lastRequestTimestamps[onboardedBy] = Date.now();
      }

      if (Array.isArray(userData) && userData.length === 0) {
        // No new data found
        console.log(`No new data found for last ${time} minutes`);
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
