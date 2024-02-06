import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Distributor } from 'src/distributor/distributor.model';
import { Reseller } from 'src/reseller/reseller.model';
import { Order } from 'src/order/order.model';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(Distributor.name) private distributorModel: Model<Distributor>,
    @InjectModel(Reseller.name) private resellerModel: Model<Reseller>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async findAllDistributors(): Promise<Distributor[]> {
    return this.distributorModel.find().exec();
  }

  async getResellers() {
    return this.resellerModel.find().exec();
  }

  async getOrders() {
    return this.orderModel.find().exec();
  }
}
