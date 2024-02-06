// src/distributor/distributor.service.ts

import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { Distributor } from './distributor.model';
import { InjectModel } from '@nestjs/mongoose';
import { distributorDto } from './distributorDto/distributorDto';
import { Model } from 'mongoose';
import { mysqlDistributorService } from './mysql/mysqlDistributor.service'

@Injectable()
export class DistributorService {
  constructor(
    @InjectModel(Distributor.name) private clientModel: Model<Distributor>,
    private readonly mySqlService: mysqlDistributorService,
  ) { }

  async getDataFromMySQLToMongo(sales_id: string): Promise<Distributor> {

    // Check if the user already exists in MongoDB
    const existingUser = await this.clientModel.findOne({ sales_id }).exec();
    if (existingUser) {
      throw new ConflictException(`User with sales_id '${sales_id}' already exists in MongoDB.`);
    }

    // Fetch data from MySQL
    const userData = await this.mySqlService.getUserDataBySalesId(sales_id);
    if (!userData) {
      throw new BadRequestException(`User with sales_id '${sales_id}' not found in MySQL.`);
    }

    // Log the retrieved MySQL data
    console.log('Retrieved MySQL data:', userData);

    // Transform MySQL data to match your MongoDB schema
    const transformedData: distributorDto = {
      email: userData.email,
      sales_id: userData.sales_id,
      total_onboarded_reseller: userData.total_onboarded_reseller,
    };

    // Save data to MongoDB
    return this.postData(transformedData);
  }

  // Post Data
  async postData(data: distributorDto): Promise<Distributor> {

    // Create a new document using the Mongoose model
    const newClient = new this.clientModel(data);

    try {
      // Save the document to the database
      const savedClient = await newClient.save();

      console.log('Data saved to mongodb database:', savedClient);
      return savedClient;
    } catch (error) {
      console.error('Failed to save data to the database:', error.message);
      throw new Error(error.message);
    }
  }
}
