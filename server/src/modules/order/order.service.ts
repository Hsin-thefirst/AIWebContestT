import { Injectable, Logger, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectQueue('order-timeout')
    private readonly timeoutQueue: Queue,
  ) {}

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    const savedOrder = await this.orderRepository.save(order);

    await this.timeoutQueue.add('timeout', { orderId: savedOrder.id }, {
      delay: 15 * 60 * 1000, 
      removeOnComplete: true,
      jobId: savedOrder.id,
    });

    return savedOrder;
  }

  async confirmPayment(orderId: string, version: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not in a pending state');
    }

    if (order.version !== version) {
      throw new ConflictException('Order version mismatch. Ghost payment race condition detected.');
    }

    order.status = OrderStatus.CONFIRMED;

    try {
      const savedOrder = await this.orderRepository.save(order);
      
      const job = await this.timeoutQueue.getJob(order.id);
      if (job) await job.remove();
      
      return savedOrder;
    } catch (error: any) {
      if (error.name === 'OptimisticLockVersionMismatchError') {
        throw new ConflictException('Concurrent modification detected. Ghost payment avoided.');
      }
      throw error;
    }
  }

  async cancelOrderTimeout(orderId: string, version: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');

    if (order.status !== OrderStatus.PENDING) {
      return order; 
    }

    if (order.version !== version) {
      throw new ConflictException('Order version mismatch');
    }

    order.status = OrderStatus.CANCELED;

    try {
      return await this.orderRepository.save(order);
    } catch (error: any) {
      if (error.name === 'OptimisticLockVersionMismatchError') {
        throw new ConflictException('Concurrent modification detected. Payment might have succeeded.');
      }
      throw error;
    }
  }

  async markNoShow(orderId: string, pointsDeduct: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order must be confirmed to be marked no-show');
    }

    order.status = OrderStatus.NO_SHOW;
    order.pointsDeducted = pointsDeduct; 

    return this.orderRepository.save(order);
  }
}
