// mongo/mongo.controller.ts

import { Controller, Get } from '@nestjs/common';
import { MongoService } from './mongo.service';

@Controller('mongo')
export class MongoController {
  constructor(private readonly mongoService: MongoService) {}

  @Get('distributors')
  async findAllDistributors() {
    return this.mongoService.findAllDistributors();
  }

  @Get('resellers')
  async getResellers() {
    return this.mongoService.getResellers();
  }

  @Get('orders')
  async getOrders() {
    return this.mongoService.getOrders();
  }
}
