// sales-channel.service.ts
import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { Client, ClientModel } from './sales-channel.model';
import { InjectModel } from '@nestjs/mongoose';
import { salesDto } from './dto/salesDto';
import { Model } from 'mongoose';
import { isNumberString, isString } from 'class-validator';

// Custom validation function for email format
const validateEmailFormat = (email: string) => {
  const emailRegex = /^[^\s@]+@gmail\.com$/;
  return emailRegex.test(email);
};

@Injectable()
export class SalesChannelService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) { }

  // Get All Clients
  async findAll(): Promise<Client[]> {
    const allData = await this.clientModel.find().exec();
    console.log(allData);

    return allData;
  }

  // Post Data
  async postData(data: salesDto): Promise<Client> {
    // Count the number of empty fields
    const emptyFields = ['email', 'salesId', 'onboardCount'].filter(field => !data[field]);

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

    // Validate email format
    if (!validateEmailFormat(data.email)) {
      console.log('Invalid email format.');
      throw new BadRequestException('Email must end with @gmail.com');
    }

    // Validate salesId is a string
    if (!isString(data.salesId)) {
      console.log('salesId must be a string value.');
      throw new BadRequestException('salesId must be a string value.');
    }

    // Check if the email or salesId already exists in the database
    const existingClientEmail = await this.clientModel.findOne({ email: data.email }).exec();
    const existingClientSalesId = await this.clientModel.findOne({ salesId: data.salesId }).exec();
    
    if (existingClientEmail || existingClientSalesId) {
      const errorMessage = existingClientEmail && existingClientSalesId
        ? 'Email and salesId already exist.'
        : existingClientEmail
          ? 'email already exists.'
          : 'salesId already exists.';
      
      console.log(errorMessage);
      throw new ConflictException(errorMessage);
    }
    
    // Validate onboardCount is a numeric string
    if (isNumberString(data.onboardCount) || isString(data.onboardCount)) {
      console.log('onboardCount must be a numeric value.');
      throw new BadRequestException('onboardCount must be a numeric value.');
    }

    // Create a new document using the Mongoose model
    const newClient = new this.clientModel(data);

    try {
      // Save the document to the database
      const savedClient = await newClient.save();

      console.log('Data saved to the database:', savedClient);
      return savedClient;
    } catch (error) {
      console.error('Failed to save data to the database:', error.message);
      throw new Error('Failed to save data to the database');
    }
  }
}
