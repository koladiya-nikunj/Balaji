// distributor.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Distributor } from 'src/distributor/distributor.model';

@Injectable()
export class DistributorService {
  constructor(@InjectModel('Distributor') private readonly distributorModel: Model<Distributor>) {}

  async findBySalesId(salesId: string): Promise<Distributor[]> {
    const distributor = await this.distributorModel.find({ sales_id: salesId }).exec();
    if (!distributor || distributor.length === 0) {
      throw new NotFoundException(`Distributor with sales_id '${salesId}' not found.`);
    }
    return distributor;
  }
}
