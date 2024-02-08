// mongo.controller.ts

import { BadRequestException, Controller, Get, NotFoundException, ParseIntPipe, Query } from '@nestjs/common';
import { DistributorService } from './mongo.service';
import { Distributor } from 'src/distributor/distributor.model';

@Controller('mongo')
export class MongoController {
  constructor(private readonly mongoService: DistributorService) {}

  @Get('distributors')
  async getDistributors(
    @Query('sales_id') salesId?: string,
  ): Promise<{ data: Distributor[] } | { error: { message: string; statusCode: number } }> {
    if (!salesId) {
      throw new BadRequestException('The sales_id parameter is required.');
    }

    const distributors = await this.mongoService.findBySalesId(salesId);
    if (!distributors || distributors.length === 0) {
      throw new NotFoundException(`Distributor with sales_id '${salesId}' not found.`);
    }

    return { data: distributors };
  }
}
