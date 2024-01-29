import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesChannelModule } from './salseChannel/sales-channel.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule,ConfigService } from '@nestjs/config';
import {Client,ClientModel} from './salseChannel/sales-channel.model'
import { UsersModule } from './users/users.module';

@Module({
  imports: [ 
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
  }),
  MongooseModule.forFeature([{ name: Client.name, schema: ClientModel }]),
  SalesChannelModule,UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
