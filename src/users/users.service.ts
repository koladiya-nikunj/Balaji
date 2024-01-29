// users/users.service.ts
import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';
import { UserDto } from './dto/users.dto';
import { isString } from 'class-validator'


// Custom validation function for email format
const validateEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
};

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async getAllUsers(): Promise<User[]> {
        const allUsers = await this.userModel.find().exec();
        console.log(allUsers);
        
        return allUsers;
    }

    async postUser(data: UserDto): Promise<User> {
        // Check if both email and userId are empty
    if (!data.email && !data.userId) {
        console.log('Email and userId are empty.');
        throw new BadRequestException('Email and userId must not be empty.');
      }

        // Check if any required fields are empty
        const requiredFields = ['email', 'userId'];
        for (const field of requiredFields) {
            if (!data[field]) {
                console.log(`${field} is empty.`);
                throw new BadRequestException(`${field} cannot be empty.`);
            }
        }

        // Validate email format
        if (!validateEmailFormat(data.email)) {
            console.log('Invalid email format.');
            throw new BadRequestException('Email must end with @gmail.com');
        }

        // Check if the email already exists in the database
        const existingClient = await this.userModel.findOne({ email: data.email }).exec();
        if (existingClient) {
            console.log('Email is already exist.');
            throw new ConflictException('Email is already exist.');
        }

        // Validate userId is a string
        if (!isString(data.userId)) {
            console.log('userId must be a string value.');
            throw new BadRequestException('userId must be a string value.');
        }

        // Create a new document using the Mongoose model
        const newClient = new this.userModel(data);

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
