import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order-request';
import { OrderRepository } from './order.repsitory';
import { BILLING_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UpdateOrderRequest } from './dto/update-order-request';

/**
 * @sinif OrdersService
 * OrdersService -  sifarişlərin idarəsi.
 *
 * @constructor
 * @param {OrderRepository} ordersRepository - Sifarişlərin saxlanılması və idarə olunması üçün repository.
 * @param {ClientProxy} billingClient - Billing xidmətinə müraciət etmək üçün müştəri.
 */
@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrderRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createOrder(request: CreateOrderRequest) {
    const session = await this.ordersRepository.startTransaction();

    try {
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }

  async updateOrder(id: string, request: UpdateOrderRequest) {
    const session = await this.ordersRepository.startTransaction();
    try {
      const filterQuery = { _id: id };
      const updateOrder = await this.ordersRepository.findAndUpdate(
        filterQuery,
        request,
      );

      await lastValueFrom(
        this.billingClient.emit('order_updated', {
          id,
          request,
        }),
      );
      await session.commitTransaction();
      return updateOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async deleteOrder(id: string) {
    const filterQuery = { _id: id };
    const deleted = await this.ordersRepository.softDelete(filterQuery);
    return deleted;
  }
}
