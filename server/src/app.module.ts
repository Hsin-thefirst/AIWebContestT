import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { SpacesModule } from './modules/spaces/spaces.module';
import { EventsModule } from './modules/events/events.module';
import { Space } from './modules/spaces/space.entity';
import { MeetingRoom } from './modules/spaces/meeting-room.entity';
import { Reservation } from './modules/spaces/reservation.entity';
import { Event } from './modules/events/event.entity';
import { Order } from './modules/events/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'mydb',
      entities: [Space, MeetingRoom, Reservation, Event, Order],
      synchronize: true,
    }),
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
    SpacesModule,
    EventsModule,
  ],
})
export class AppModule {}
