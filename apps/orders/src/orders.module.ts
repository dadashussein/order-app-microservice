import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule } from '@app/common';
import { OrderRepository } from './order.repsitory';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/orders.schema';
import { BILLING_SERVICE } from './constants/services';

/**
 * @module OrdersModule
 *
 * Bu modul sifarişlər üçün əsas moduldur.
 *
 * @imports
 * - ConfigModule: Konfiqurasiya modulu, qlobal olaraq istifadə olunur və .env faylından konfiqurasiya parametrlərini oxuyur.
 * - DatabaseModule: Verilənlər bazası modulu.
 * - MongooseModule: Mongoose modulu, sifarişlər üçün Mongoose sxemini qeydiyyatdan keçirir.
 * - RmqModule: RabbitMQ modulu, BILLING_SERVICE üçün qeydiyyatdan keçirir.
 *
 * @controllers
 * - OrdersController: Sifarişlər üçün kontroller.
 *
 * @providers
 * - OrdersService: Sifarişlər üçün xidmət.
 * - OrderRepository: Sifarişlər üçün repozitoriya.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/orders/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository],
})
export class OrdersModule {}
