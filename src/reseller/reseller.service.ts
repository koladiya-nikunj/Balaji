// src/reseller/reseller.service.ts

import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Reseller } from './reseller.model';
import { InjectModel } from '@nestjs/mongoose';
import { ResellerDto } from './resellerDto/resellerDto';
import { Model } from 'mongoose';
import { MySqlResellerService } from './resellerMysql/mysqlReseller.service';

@Injectable()
export class ResellerService {
  constructor(
    @InjectModel(Reseller.name) private resellerModel: Model<Reseller>,
    private readonly mySqlResellerService: MySqlResellerService,
  ) { }

  async getDataSinceLastRequest(onboarded_by: string, lastRequestTimestamp: number): Promise<Reseller[]> {
    // Retrieve data since the last request timestamp
    const resellerData = await this.resellerModel.find({
      created_date: { $gte: new Date(lastRequestTimestamp) },
      onboarded_by,
    });

    if (resellerData.length === 0) {
      // Return a meaningful response instead of throwing an error
      return [];
    }

    return resellerData;
  }


  async findRecentResell(minutesAgo: number): Promise<ResellerDto[]> {
    const timestampFilter = new Date(Date.now() - minutesAgo * 60 * 1000);

    try {
      const allUserData = await this.resellerModel.find({
        created_date: { $gte: timestampFilter },
      });

      // Transform MySQL data to match your MongoDB schema
      const transformedData: ResellerDto[] = allUserData.map(user => ({
        email: user.email,
        user_id: user.user_id,
        onboarded_by: user.onboarded_by,
        created_date: new Date(user.created_date),
      }));

      return transformedData;
    } catch (error) {
      throw new Error(`Error fetching recent reseller: ${error.message}`);
    }
  }


  async getDataFromMySQLToMongo(minutesAgo: number, onboarded_by: string): Promise<Reseller[]> {
    // Fetch all data with the same onboarded_by from MySQL
    const allUserData = await this.mySqlResellerService.getUserDataByUsesId(onboarded_by);
    if (!Array.isArray(allUserData) || allUserData.length === 0) {
      throw new HttpException(`Reseller with onboarded_by '${onboarded_by}' not found in MySQL.`,HttpStatus.BAD_REQUEST);
    }

    // Log the retrieved MySQL data
    console.log('Retrieved MySQL data:', allUserData);

    // Transform MySQL data to match your MongoDB schema
    const transformedData: ResellerDto[] = allUserData.map(user => ({
      email: user.email,
      user_id: user.user_id,
      onboarded_by: user.onboarded_by,
      created_date: user.created_date.toLocaleString()
    }));

    // Save data to MongoDB
    const savedReseller = await this.postData(transformedData);

    // Log the saved MongoDB data
    console.log('Data saved to MongoDB database:', savedReseller);

    return savedReseller;
  }

  // Post Data
  async postData(data: ResellerDto[]): Promise<Reseller[]> {
    const savedReseller = [];

    // Iterate over each transformed user and save individually
    for (const user of data) {
      const newUser = new this.resellerModel(user);

      try {
        const savedUser = await newUser.save();
        savedReseller.push(savedUser);
      } catch (error) {
        console.error('Failed to save data, because some data are missing in mysql databas:', error.message);
        throw new HttpException(error.message,HttpStatus.BAD_REQUEST);
      }
    }

    return savedReseller;
  }
}
