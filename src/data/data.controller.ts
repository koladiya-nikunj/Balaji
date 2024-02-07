import { BadRequestException, Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { OrderService } from "src/order/order.service";
import { DistributorService } from 'src/distributor/distributor.service';
import { ResellerService } from 'src/reseller/order.service';
@Controller()
export class DataController {
    constructor(
        private readonly orderService: OrderService,
        private readonly distributorService: DistributorService,
        private readonly resellerService: ResellerService
    ) {}

    @Get('data')
    async handleRequests(
        @Query('sales_id') salesId: string,
        @Query('user_id') userId: string,
        @Query('onboarded_by') onboardedBy: string,
        @Query('time', ParseIntPipe) time: number
    ): Promise<{ data: any[] } | { error: { message: string; statusCode: number } }> {
        try {
            if (salesId) {
                // Handle distributor route logic
                const distributorData = await this.distributorService.getDataFromMySQLToMongo(time, salesId);
                return { data: distributorData };
            } else if (userId) {
                // Handle order route logic
                const orderData = await this.orderService.getDataFromMySQLToMongo(time, userId);
                return { data: orderData };
            } else if (onboardedBy) {
                // Handle reseller route logic
                const resellerData = await this.resellerService.getDataFromMySQLToMongo(time, onboardedBy);
                return { data: resellerData };
            } else {
                throw new BadRequestException('Invalid parameters');
            }
        } catch (error) {
            console.error(error.message);
            throw new BadRequestException(error.message);
        }
    }
}
