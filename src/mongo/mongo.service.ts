import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/order/order.model';


@Injectable()
export class MongoService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}


  async getOrders() {
    return this.orderModel.find().exec();
  }

}
