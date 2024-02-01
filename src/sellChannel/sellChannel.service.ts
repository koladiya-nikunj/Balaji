// sellChannel.service.ts
import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { Client, ClientModel } from './sellChannel.model';
import { InjectModel } from '@nestjs/mongoose';
import { sellDto } from './dto/sellDto';
import { Model } from 'mongoose';
import { isNumberString, isString } from 'class-validator';
import { MySqlService } from './mysql/mysql.service'

@Injectable()
export class SellChannelService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>,
     private readonly mySqlService: MySqlService,
  ) { }

  async getDataFromMySQLToMongo(sales_id: string): Promise<Client> {
    // Fetch data from MySQL
    const userData = await this.mySqlService.getUserDataBySalesId(sales_id);

    if (!userData) {
      throw new BadRequestException(`User with sales_id ${sales_id} not found in MySQL.`);
    }

    // Log the retrieved MySQL data
    console.log('Retrieved MySQL data:', userData);

    // Transform MySQL data to match your MongoDB schema
    const transformedData: sellDto = {
      email: userData.email,
      sales_id: userData.sales_id,
      total_onboarded_reseller: userData.total_onboarded_reseller, 
    };

    // Save data to MongoDB
    return this.postData(transformedData);
  }

  // Get All Clients
  async findAll(): Promise<Client[]> {
    const allData = await this.clientModel.find().exec();
    console.log(allData);

    return allData;
  }

  // Post Data
  async postData(data: sellDto): Promise<Client> {
    // Count the number of empty fields
    const emptyFields = ['email', 'sales_id', 'total_onboarded_reseller'].filter(field => !data[field]);

    // Check if any field is empty
    if (emptyFields.length === 1) {
      console.log(`${emptyFields[0]} is empty.`);
      throw new BadRequestException(`${emptyFields[0]} cannot be empty.`);
    } else if (emptyFields.length === 2) {
      console.log(`${emptyFields[0]} and ${emptyFields[1]} are empty.`);
      throw new BadRequestException(`${emptyFields[0]} and ${emptyFields[1]} cannot be empty.`);
    } else if (emptyFields.length === 3) {
      console.log(`${emptyFields[0]}, ${emptyFields[1]}, and ${emptyFields[2]} are empty.`);
      throw new BadRequestException(`${emptyFields[0]}, ${emptyFields[1]}, and ${emptyFields[2]} cannot be empty.`);
    }

    // Validate sales_id is a string
    if (!isString(data.sales_id)) {
      console.log('sales_id must be a string value.');
      throw new BadRequestException('sales_id must be a string value.');
    }

    // Check if the email or sales_id already exists in the database
    const existingClientEmail = await this.clientModel.findOne({ email: data.email }).exec();
    const existingClientsales_id = await this.clientModel.findOne({ sales_id: data.sales_id }).exec();
    
    if (existingClientEmail || existingClientsales_id) {
      const errorMessage = existingClientEmail && existingClientsales_id
        ? 'email and sales_id already exist.'
        : existingClientEmail
          ? 'email already exists.'
          : 'sales_id already exists.';
      
      throw new ConflictException(errorMessage);
    }
    
    
    // Validate total_onboarded_reseller is a numeric string
    if (isNumberString(data.total_onboarded_reseller) || isString(data.total_onboarded_reseller)) {
      console.log('total_onboarded_reseller must be a numeric value.');
      throw new BadRequestException('total_onboarded_reseller must be a numeric value.');
    }

    // Create a new document using the Mongoose model
    const newClient = new this.clientModel(data);

    try {
      // Save the document to the database
      const savedClient = await newClient.save();

      console.log('Data saved to mongodb database:', savedClient);
      return savedClient;
    } catch (error) {
      console.error('Failed to save data to the database:', error.message);
      throw new Error('Failed to save data to the database');
    }
  }
}
