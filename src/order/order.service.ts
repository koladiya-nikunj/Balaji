// src/users/users.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { Order } from './order.model';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDto } from './dto/order.dto';
import { Model } from 'mongoose';
import { MySqlOrderService } from './orderMysql/mysqlOrder.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private usersModel: Model<Order>,
    private readonly mySqlUserService: MySqlOrderService,
  ) { }

  async getDataSinceLastRequest(onboarded_by: string, lastRequestTimestamp: number): Promise<Order[]> {
    // Retrieve data since the last request timestamp
    const userData = await this.usersModel.find({
      created_date: { $gte: new Date(lastRequestTimestamp) },
      onboarded_by,
    });

    if (userData.length === 0) {
      // Return a meaningful response instead of throwing an error
      return [];
    }

    return userData;
  }


  async findRecentUsers(minutesAgo: number): Promise<OrderDto[]> {
    const timestampFilter = new Date(Date.now() - minutesAgo * 60 * 1000);

    try {
      const allUserData = await this.usersModel.find({
        created_date: { $gte: timestampFilter },
      });

      // Transform MySQL data to match your MongoDB schema
      const transformedData: OrderDto[] = allUserData.map(user => ({
        order_id: user.order_id,
        user_id: user.user_id,
        pickup_address_pincode: user.pickup_address_pincode,
        shipment_length: user.shipment_length,
        shipment_width:user.shipment_width,
        shipment_height:user.shipment_height,
        weight:user.weight,
        amount:user.amount,
        invoice_order:user.invoice_order,
        provider_label:user.provider_label
      }));

      return transformedData;
    } catch (error) {
      throw new Error(`Error fetching recent users: ${error.message}`);
    }
  }


  async getDataFromMySQLToMongo(minutesAgo: number, onboarded_by: string): Promise<Order[]> {
    // Fetch all data with the same onboarded_by from MySQL
    const allUserData = await this.mySqlUserService.getUserDataByUsesId(onboarded_by);
    if (!Array.isArray(allUserData) || allUserData.length === 0) {
      throw new BadRequestException(`Users with onboarded_by '${onboarded_by}' not found in MySQL.`);
    }

    // Log the retrieved MySQL data
    console.log('Retrieved MySQL data:', allUserData);

    // Transform MySQL data to match your MongoDB schema
    const transformedData: OrderDto[] = allUserData.map(user => ({
      order_id: user.order_id,
        user_id: user.user_id,
        pickup_address_pincode: user.pickup_address_pincode,
        shipment_length: user.shipment_length,
        shipment_width:user.shipment_width,
        shipment_height:user.shipment_height,
        weight:user.weight,
        amount:user.amount,
        invoice_order:user.invoice_order,
        provider_label:user.provider_label
    }));

    // Save data to MongoDB
    const savedUsers = await this.postData(transformedData);

    // Log the saved MongoDB data
    console.log('Data saved to MongoDB database:', savedUsers);

    return savedUsers;
  }

  // Post Data
  async postData(data: OrderDto[]): Promise<Order[]> {
    const savedUsers = [];

    // Iterate over each transformed user and save individually
    for (const user of data) {
      const newUser = new this.usersModel(user);

      try {
        const savedUser = await newUser.save();
        savedUsers.push(savedUser);
      } catch (error) {
        console.error('Failed to save data, because some data are missing in mysql databas:', error.message);
        throw new Error(error.message);
      }
    }

    return savedUsers;
  }
}
