// mongo/mongo.controller.ts

import { Controller, Get } from '@nestjs/common';
import { MongoService } from './mongo.service';

@Controller('mongo')
export class MongoController {
  constructor(private readonly mongoService: MongoService) {}

  @Get('')
  async getOrders() {
    return this.mongoService.getOrders();
  }

}
