import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DistributorModule } from './distributor/distributor.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule,ConfigService } from '@nestjs/config';
import {Distributor,DistributorModel} from './distributor/distributor.model'
import { ResellerModule } from './reseller/order.module';
import { OrderModule } from './order/order.module';
import { MySqlDistributorModule } from './distributor/mysql/mysqlDistributor.module';
import { MySqlResellerModule } from './reseller/orderMysql/mysqlReseller.module';
import { MongoModule } from './mongo/mongo.module';
import { DataModule } from './data/data.module';
import { SellChannelModule } from './sellChannel/sellChannel.module';

@Module({
  imports: [ MongoModule,DataModule,SellChannelModule,
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env'],
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get('URI'),
    }),
    inject: [ConfigService],
  }),MySqlDistributorModule,MySqlResellerModule,
  MongooseModule.forFeature([{ name: Distributor.name, schema: DistributorModel }]),
  DistributorModule,ResellerModule,OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
