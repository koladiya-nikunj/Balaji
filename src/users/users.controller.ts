// src/sellChannel/sellChannel.controller.ts
import { Body, Controller, Get, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getApi(@Body() body: { onboarded_by: string }) {
    try {
      if (!body.onboarded_by) {
        throw new Error('onboarded_by must not be empty in the request body');
      }
      // Check if sales_id is a string
      if (typeof body.onboarded_by !== 'string') {
        throw new Error('onboarded_by must be a string in the request body');
      }
      const userData = await this.usersService.getDataFromMySQLToMongo(body.onboarded_by);

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
