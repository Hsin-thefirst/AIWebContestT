import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, GreaterThan } from 'typeorm';
import { Space } from './space.entity';
import { Reservation } from './reservation.entity';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private spacesRepository: Repository<Space>,
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  async createSpace(spaceData: Partial<Space>): Promise<Space> {
    const space = this.spacesRepository.create(spaceData);
    return this.spacesRepository.save(space);
  }

  async getSpaces(): Promise<Space[]> {
    return this.spacesRepository.find();
  }

  async reserveSpace(spaceId: string, userId: string, startTime: Date, endTime: Date): Promise<Reservation> {
    const space = await this.spacesRepository.findOne({ where: { id: spaceId } });
    if (!space) {
      throw new Error('Space not found');
    }

    const bufferMinutes = 5;
    const startWithBuffer = new Date(startTime.getTime() - bufferMinutes * 60000);
    const endWithBuffer = new Date(endTime.getTime() + bufferMinutes * 60000);

    const conflictingReservation = await this.reservationsRepository.findOne({
      where: {
        space: { id: spaceId },
        startTime: LessThan(endWithBuffer),
        endTime: GreaterThan(startWithBuffer),
        status: 'confirmed',
      },
    });

    if (conflictingReservation) {
      throw new ConflictException('Space is not available for the requested time due to another reservation or buffer period.');
    }

    const reservation = this.reservationsRepository.create({
      space,
      userId,
      startTime,
      endTime,
      status: 'confirmed',
    });

    return this.reservationsRepository.save(reservation);
  }

  async createReservation(spaceId: string, userId: string, startTime: Date, endTime: Date): Promise<Reservation> {
    return this.reserveSpace(spaceId, userId, startTime, endTime);
  }
}
