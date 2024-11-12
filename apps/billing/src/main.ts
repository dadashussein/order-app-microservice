import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { RmqService } from '@app/common/rmq/rmq.service';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const rmqService = app.get<RmqService>(RmqService)
  app.connectMicroservice(rmqService.getOptions('BILLING'))
  await app.startAllMicroservices();
}
bootstrap();
