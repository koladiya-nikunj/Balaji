// users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserModel } from './users.model';
import { MySqlUserModule } from './userMysql/mysqlUser.module';

@Module({
  imports: [MySqlUserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserModel }]),
  ],
  controllers: [UsersController],
  providers: [UsersService,MySqlUserModule],
})
export class UsersModule {}
