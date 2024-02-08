// src/order/order.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { Reseller } from './order.model';
import { InjectModel } from '@nestjs/mongoose';
import { ResellerDto } from './orderDto/order.dto';
import { Model } from 'mongoose';
import { MySqlResellerService } from './orderMysql/mysqlReseller.service';

@Injectable()
export class ResellerService {
  constructor(
    @InjectModel(Reseller.name) private usersModel: Model<Reseller>,
    private readonly mySqlUserService: MySqlResellerService,
  ) { }

  async getDataSinceLastRequest(onboarded_by: string, lastRequestTimestamp: number): Promise<Reseller[]> {
    // Retrieve data since the last request timestamp
    const userData = await this.usersModel.find({
      created_date: { $gte: new Date(lastRequestTimestamp) },
      onboarded_by,
    });

    return userData;
  }


  async findRecentUsers(minutesAgo: number): Promise<ResellerDto[]> {
    const timestampFilter = new Date(Date.now() - minutesAgo * 60 * 1000);

    try {
      const allUserData = await this.usersModel.find({
        created_date: { $gte: timestampFilter },
      });

      // Transform MySQL data to match your MongoDB schema
      const transformedData: ResellerDto[] = allUserData.map(user => ({
        email: user.email,
        user_id: user.user_id,
        onboarded_by: user.onboarded_by,
        created_date: user.created_date
      }));

      return transformedData;
    } catch (error) {
      throw new Error(`Error fetching recent users: ${error.message}`);
    }
  }


  async getDataFromMySQLToMongo(minutesAgo: number, onboarded_by: string): Promise<Reseller[]> {
    // Fetch all data with the same onboarded_by from MySQL
    const allUserData = await this.mySqlUserService.getUserDataByUsesId(onboarded_by);
    if (!Array.isArray(allUserData) || allUserData.length === 0) {
      throw new BadRequestException(`Users with onboarded_by '${onboarded_by}' not found in MySQL.`);
    }

    // Log the retrieved MySQL data
    console.log('Retrieved MySQL data:', allUserData);

    // Transform MySQL data to match your MongoDB schema
    const transformedData: ResellerDto[] = allUserData.map(user => ({
      email: user.email,
      user_id: user.user_id,
      onboarded_by: user.onboarded_by,
      created_date: user.created_date
    }));

    // Save data to MongoDB
    const savedUsers = await this.postData(transformedData);

    // Log the saved MongoDB data
    console.log('Data saved to MongoDB database:', savedUsers);

    return savedUsers;
  }

  // Post Data
  async postData(data: ResellerDto[]): Promise<Reseller[]> {
    const savedUsers = [];

    // Iterate over each transformed user and save individually
    for (const user of data) {

      const newUser = new this.usersModel({
        email: user.email,
        user_id: user.user_id,
        onboarded_by: user.onboarded_by,
        created_date: user.created_date
      });

      try {
        const savedUser = await newUser.save();
        savedUsers.push(savedUser);
      } catch (error) {
        console.error('Failed to save data:', error.message);
        throw new Error(error.message);
      }
    }

    return savedUsers;
  }


}
