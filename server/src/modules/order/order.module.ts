import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { OrderService } from './order.service';
import { OrderTimeoutProcessor } from './order-timeout.processor';
import { Order } from './entities/order.entity';
import { ReservationRulesModule } from '../reservation-rules/reservation-rules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    BullModule.registerQueue({
      name: 'order-timeout',
    }),
    ReservationRulesModule,
  ],
  providers: [OrderService, OrderTimeoutProcessor],
  exports: [OrderService],
})
export class OrderModule {}
