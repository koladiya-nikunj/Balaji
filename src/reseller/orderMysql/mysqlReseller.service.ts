// src/order/mysqlUser/mysqlOrder.service.ts

import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MySqlResellerService {
  private connection;

  constructor() {
    this.connection = mysql.createPool({
      host: 'coreyo-prod-db.czky28z9lbgg.ap-south-1.rds.amazonaws.com',
      user: 'hiren',
      password: '9yT64n7eSTYe',
      database: 'coreyodb',
    });
  }

  async getUserDataByUsesId(onboarded_by: string) {
    try {
      const [rows] = await this.connection.execute('SELECT * FROM coreyodb.users_data WHERE onboarded_by = ?', [onboarded_by]);
      return rows;
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw error; // Rethrow the error to handle it at a higher level
    }
  }
}
