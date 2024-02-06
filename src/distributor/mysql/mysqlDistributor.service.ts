// src/distributor/mysql/mysqlDistributor.service.ts

import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class mysqlDistributorService {
  private connection;

  constructor() {
    this.connection = mysql.createPool({
      host: 'coreyo-prod-db.czky28z9lbgg.ap-south-1.rds.amazonaws.com',
      user: 'hiren',
      password: '9yT64n7eSTYe',
      database: 'coreyodb',
    });
  }

  async getUserDataBySalesId(sales_id: string) {
    try {
      const [rows] = await this.connection.execute('SELECT * FROM coreyodb.sales_team WHERE sales_id = ?', [sales_id]);
      if (rows) {
        return rows[0]; // Assuming you want the first row
      } else {
        console.log('Sales ID not found');
        throw new Error('Sales ID not found');
      }
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw error; // Rethrow the error to handle it at a higher level
    }
  }
}
