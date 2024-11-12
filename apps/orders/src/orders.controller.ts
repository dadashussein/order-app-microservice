import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequest } from './dto/create-order-request';
import { UpdateOrderRequest } from './dto/update-order-request';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() request: CreateOrderRequest) {
    return this.ordersService.createOrder(request);
  }

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() request: UpdateOrderRequest,
  ) {
    return this.ordersService.updateOrder(id, request);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    if (id !== 'id') {
      throw new NotFoundException('Order not found');
    }
    return this.ordersService.deleteOrder(id);
  }
}
