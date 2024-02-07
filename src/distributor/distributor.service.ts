// src/distributor/distributor.service.ts

import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { Distributor } from './distributor.model';
import { InjectModel } from '@nestjs/mongoose';
import { DistributorDto } from './distributorDto/distributorDto';
import { Model } from 'mongoose';
import { MysqlDistributorService } from './mysql/mysqlDistributor.service'

@Injectable()
export class DistributorService {
  constructor(
    @InjectModel(Distributor.name) private clientModel: Model<Distributor>,
    private readonly mySqlService: MysqlDistributorService,
  ) { }

  async getDataSinceLastRequest(sales_id: string, lastRequestTimestamp: number): Promise<Distributor[]> {
    // Retrieve data since the last request timestamp
    const userData = await this.clientModel.find({
      created_date: { $gte: new Date(lastRequestTimestamp) },
      sales_id,
    });

    if (userData.length === 0) {
      // Return a meaningful response instead of throwing an error
      return [];
    }

    return userData;
  }


  async findRecentUsers(minutesAgo: number): Promise<DistributorDto[]> {
    const timestampFilter = new Date(Date.now() - minutesAgo * 60 * 1000);

    try {
      const allUserData = await this.clientModel.find({
        created_date: { $gte: timestampFilter },
      });

      // Transform MySQL data to match your MongoDB schema
      const transformedData: DistributorDto[] = allUserData.map(user => ({
        email: user.email,
        name:user.name,
        sales_id: user.sales_id,
        total_onboarded_reseller: user.total_onboarded_reseller,
        created_date:user.created_date
      }));

      return transformedData;
    } catch (error) {
      throw new Error(`Error fetching recent users: ${error.message}`);
    }
  }


  async getDataFromMySQLToMongo(minutesAgo: number, sales_id: string): Promise<Distributor[]> {
    // Fetch all data with the same sales_id from MySQL
    const allUserData = await this.mySqlService.getUserDataByUsesId(sales_id);
    if (!Array.isArray(allUserData) || allUserData.length === 0) {
      throw new BadRequestException(`Users with sales_id '${sales_id}' not found in MySQL.`);
    }

    // Log the retrieved MySQL data
    console.log('Retrieved MySQL data:', allUserData);

    // Transform MySQL data to match your MongoDB schema
    const transformedData: DistributorDto[] = allUserData.map(user => ({
        email: user.email,
        sales_id: user.sales_id,
        name:user.name,
        total_onboarded_reseller: user.total_onboarded_reseller,
        created_date:user.created_date
    }));

    // Save data to MongoDB
    const savedUsers = await this.postData(transformedData);

    // Log the saved MongoDB data
    console.log('Data saved to MongoDB database:', savedUsers);

    return savedUsers;
  }

  async postData(data: DistributorDto[]): Promise<Distributor[]> {
    const savedUsers = [];
  
    // Iterate over each transformed user and save individually
    for (const user of data) {
  console.log('data transfer to mongo :',data);
  
      // Create a new Distributor instance
      const newUser = new this.clientModel(user);
  console.log('New instance :',newUser);
  
      try {
        // Save the user to MongoDB
        const savedUser = await newUser.save();
        savedUsers.push(savedUser);
console.log('saved to mongo :',savedUser);
        
      } catch (error) {
        console.error('Failed to save data:', error.message);
        // Rethrow the error or handle it appropriately
        throw new Error(error.message);
      }
    }
  
    return savedUsers;
  }
  
  

}
