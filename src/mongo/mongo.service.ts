import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reseller } from 'src/reseller/order.model';
import { Order } from 'src/order/order.model';
import { Client } from 'src/sellChannel/sellChannel.model';
@Injectable()
export class MongoService {
  constructor(
    // @InjectModel(Reseller.name) private resellerModel: Model<Reseller>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Client.name) private sellModel: Model<Client>,
  ) {}


  // async getResellers() {
  //   return this.resellerModel.find().exec();
  // }

  async getOrders() {
    return this.orderModel.find().exec();
  }

  async getSeller() {
    return this.sellModel.find().exec();
  }
}
