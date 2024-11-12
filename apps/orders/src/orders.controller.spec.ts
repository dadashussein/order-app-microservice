import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderRequest } from './dto/create-order-request';

describe('OrdersController', () => {
  let ordersController: OrdersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    }).compile();

    ordersController = app.get<OrdersController>(OrdersController);
  });
});

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            createOrder: jest.fn(),
            getOrders: jest.fn(),
          },
        },
      ],
    }).compile();

    ordersController = app.get<OrdersController>(OrdersController);
    ordersService = app.get<OrdersService>(OrdersService);
  });

  describe('createOrder', () => {
    it('should call OrdersService.createOrder with the correct parameters', async () => {
      const createOrderRequest: CreateOrderRequest = {
        name: 'Test Order',
        price: 100,
        phoneNumber: '1234567890',
      };
      await ordersController.createOrder(createOrderRequest);
      expect(ordersService.createOrder).toHaveBeenCalledWith(
        createOrderRequest,
      );
    });
  });

  describe('getOrders', () => {
    it('should call OrdersService.getOrders', async () => {
      await ordersController.getOrders();
      expect(ordersService.getOrders).toHaveBeenCalled();
    });
  });
});
