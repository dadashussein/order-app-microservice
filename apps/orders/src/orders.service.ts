import { Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order-request';
import { OrderRepository } from './order.repsitory';

@Injectable()
export class OrdersService {

  constructor(private readonly ordersRepository: OrderRepository) { }

  async createOrder(request: CreateOrderRequest) {
    return this.ordersRepository.create(request);
  }

  async getOrders() {
    return this.ordersRepository.find({})
  }
}
