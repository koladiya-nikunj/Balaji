// src/users/users.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
import { UsersDto } from './dto/users.dto';
import { Model } from 'mongoose';
import { MySqlUserService } from './userMysql/mysqlUser.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    private readonly mySqlUserService: MySqlUserService,
  ) { }

  async getDataFromMySQLToMongo(onboarded_by: string): Promise<User[]> {
    // Fetch all data with the same onboarded_by from MySQL
    const allUserData = await this.mySqlUserService.getUserDataByUsesId(onboarded_by);
    if (!Array.isArray(allUserData) || allUserData.length === 0) {
      throw new BadRequestException(`Users with onboarded_by '${onboarded_by}' not found in MySQL.`);
    }
  
    // Log the retrieved MySQL data
    console.log('Retrieved MySQL data:', allUserData);
  
    // Transform MySQL data to match your MongoDB schema
    const transformedData: UsersDto[] = allUserData.map(user => ({
      email: user.email,
      user_id: user.user_id,
      onboarded_by: user.onboarded_by,
    }));
  
    // Save data to MongoDB
    const savedUsers = await this.postData(transformedData);

    // Log the saved MongoDB data
    console.log('Data saved to MongoDB database:', savedUsers);

    return savedUsers;
  }

  // Post Data
  async postData(data: UsersDto[]): Promise<User[]> {
    const savedUsers = [];

    // Iterate over each transformed user and save individually
    for (const user of data) {
      const newUser = new this.usersModel(user);

      try {
        const savedUser = await newUser.save();
        savedUsers.push(savedUser);
      } catch (error) {
        console.error('Failed to save data to the database:', error.message);
        throw new Error('Failed to save data to the database');
      }
    }

    return savedUsers;
  }
}
