import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { EventsService } from './events.service';
import { Event } from './event.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() eventData: Partial<Event>): Promise<Event> {
    return this.eventsService.createEvent(eventData);
  }

  @Post(':id/purchase')
  async purchaseTicket(
    @Param('id') eventId: string,
    @Body('userId') userId: string
  ) {
    return this.eventsService.purchaseTicket(eventId, userId);
  }

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: { eventId: string; userId: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    
    try {
      await this.eventsService.processOrder(data);
      channel.ack(originalMsg);
    } catch (error) {
      console.error('Error processing order:', error);
      channel.nack(originalMsg, false, false);
    }
  }
}
