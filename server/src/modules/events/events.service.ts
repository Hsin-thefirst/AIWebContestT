import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Order } from './order.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { ClientProxy } from '@nestjs/microservices';
import Redlock from 'redlock';

@Injectable()
export class EventsService {
  private redlock: Redlock;

  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRedis() private readonly redis: Redis,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {
    this.redlock = new Redlock([this.redis], {
      driftFactor: 0.01,
      retryCount: 10,
      retryDelay: 200,
      retryJitter: 200,
      automaticExtensionThreshold: 500,
    });
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const event = this.eventsRepository.create(eventData);
    const savedEvent = await this.eventsRepository.save(event);
    await this.redis.set(`event:${savedEvent.id}:stock`, savedEvent.stock);
    return savedEvent;
  }

  async purchaseTicket(eventId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const lockKey = `locks:event:${eventId}:purchase:${userId}`;
    const ttl = 5000;

    let lock;
    try {
      lock = await this.redlock.acquire([lockKey], ttl);

      const stockKey = `event:${eventId}:stock`;
      const currentStock = await this.redis.get(stockKey);

      if (currentStock === null) {
        throw new BadRequestException('Event not found or stock not initialized');
      }

      if (parseInt(currentStock, 10) <= 0) {
        throw new BadRequestException('Tickets sold out');
      }

      await this.redis.decr(stockKey);

      this.rabbitClient.emit('order_created', { eventId, userId });

      return { success: true, message: 'Ticket purchase request submitted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to acquire lock or process purchase');
    } finally {
      if (lock) {
        await lock.release().catch(e => console.error(e));
      }
    }
  }

  async processOrder(data: { eventId: string; userId: string }): Promise<void> {
    const event = await this.eventsRepository.findOne({ where: { id: data.eventId } });
    if (!event) return;

    const order = this.ordersRepository.create({
      event,
      userId: data.userId,
      status: 'confirmed',
    });
    
    await this.ordersRepository.save(order);
    
    await this.eventsRepository.decrement({ id: event.id }, 'stock', 1);
  }
}
