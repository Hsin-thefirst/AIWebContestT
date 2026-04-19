import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OrderService } from './order.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Processor('order-timeout')
export class OrderTimeoutProcessor {
  private readonly logger = new Logger(OrderTimeoutProcessor.name);

  constructor(
    private readonly orderService: OrderService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  @Process('timeout')
  async handleTimeout(job: Job<{ orderId: string }>) {
    this.logger.debug('Processing timeout for order: ' + job.data.orderId);
    
    const order = await this.orderRepository.findOne({ where: { id: job.data.orderId } });
    
    if (!order) {
      this.logger.error('Order not found in timeout processor');
      return;
    }

    try {
      if (order.status === 'PENDING') {
        await this.orderService.cancelOrderTimeout(order.id, order.version);
        this.logger.log(`Order ${order.id} canceled due to payment timeout.`);
      }
    } catch (error) {
      this.logger.warn(`Could not cancel order timeout due to conflict (payment likely succeeded for ${order.id}).`);
    }
  }
}
