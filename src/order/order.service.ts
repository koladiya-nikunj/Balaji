// order.service.ts

import { Injectable, ConflictException, BadRequestException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderModel } from './order.model';
import { OrderDto } from './dto/order.dto';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class OrderService {

  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { }
  
  // Get All Ordrs
  async getAllOrders(): Promise<Order[]> {
    const allOrders = await this.orderModel.find().exec();
    return allOrders;
  }

  // Post order
  async postOrder(data: OrderDto): Promise<Order> {

    // // Check if any required fields are empty
    const requiredFields = ['orderId', 'amount', 'pin', 'invoice', 'weight', 'height', 'length', 'label'];
    let emptyFields = [];

    for (const field of requiredFields) {
      if (!data[field]) {
        console.log(`${field} is empty.`);
        emptyFields.push(field);
      }
    }

    if (emptyFields.length > 0) {
      const errorMessage = (emptyFields.length === 1)
        ? `${emptyFields[0]} cannot be empty.`
        : `${emptyFields.join(', ')} cannot be empty.`;

        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    //  Validation for orderId, invoice, and label are not numbers
    const invalidNumberFields = ['orderId', 'invoice', 'label'].filter(field => typeof data[field] === 'number');

    if (invalidNumberFields.length > 0) {
      const errorMessage = `Invalid input: ${invalidNumberFields.join(', ')} cannot be numbers.`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    // Check for Duplicates of orderId, invoice & label
    const fieldsToCheck = ['orderId', 'invoice', 'label'];
    const duplicateFields = [];

    for (const field of fieldsToCheck) {
      if (data[field] && await this.orderModel.findOne({ [field]: data[field] }).exec()) {
        duplicateFields.push(field);
      }
    }

    if (duplicateFields.length > 0) {
      let errorMessage = 'Duplicate entry: ';

      if (duplicateFields.length === 1) {
        errorMessage += `${duplicateFields[0]} is duplicate.`;
      } else {
        errorMessage += `${duplicateFields.join(', ')} are duplicate.`;
      }

      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.CONFLICT);
    }

    // pin validation
    const pinValue = data.pin;

    if (typeof pinValue !== 'number' || isNaN(pinValue) || !(/^\d{6}$/.test(pinValue.toString()))) {
      const pinErrorMessage = 'Invalid input: pin must be a number and must be a 6-digit number.';
      console.log(pinErrorMessage);
      throw new HttpException(pinErrorMessage, HttpStatus.BAD_REQUEST);
    }

    // validation for weight, height & length 
    const stringFields = ['weight', 'height', 'length'].filter(field => typeof data[field] === 'string');
    const errorMessage = (stringFields.length === 1)
      ? `Invalid input: ${stringFields[0]} must be a number.`
      : `Invalid input: ${stringFields.join(stringFields.length === 2 ? ' and ' : ', ')} must be numbers.`;

    if (stringFields.length > 0) {
      console.log(errorMessage);
      throw new BadRequestException(errorMessage);
    }

    // Amount validation
    const amountValue = data.amount;

    if (typeof amountValue !== 'number' || isNaN(amountValue)) {
      const amountErrorMessage = 'Invalid input: amount must be a number.';
      console.log(amountErrorMessage);
      throw new BadRequestException(amountErrorMessage);
    }

    // Create a new order document using the Mongoose model
    const newOrder = new this.orderModel(data);

    try {
      // Save the document to the database
      const savedOrder = await newOrder.save();

      console.log('Data saved to the database:', savedOrder);
      
      return savedOrder;
    } catch (error) {

      if (error.message.includes('duplicate key error')) {
        throw new ConflictException('Duplicate entry. OrderId must be unique.');
      } else {
        console.error('Failed to save data to the database:', error.message);
        throw new Error('Failed to save data to the database');
      }
    }
  }
}
