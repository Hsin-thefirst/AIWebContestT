import { Test, TestingModule } from '@nestjs/testing';
import { SpacesService } from '../src/modules/spaces/spaces.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from '../src/modules/spaces/entities/reservation.entity';
import { Space, SpaceType } from '../src/modules/spaces/entities/space.entity';
import { ConflictException } from '@nestjs/common';

describe('SpacesService Overlap Logic', () => {
  let service: SpacesService;
  let repo: Repository<Reservation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpacesService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: { findOne: jest.fn(), create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(Space),
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SpacesService>(SpacesService);
    repo = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
  });

  it('should block reservations within the 5-minute buffer for academic spaces', async () => {
    const startTime = new Date('2026-05-01T10:00:00Z');
    const endTime = new Date('2026-05-01T11:00:00Z');
    
    const mockOverlap = { id: 'existing' };
    jest.spyOn(repo, 'findOne').mockResolvedValue(mockOverlap as any);
    
    await expect(service.createReservation('space-id', 'user-id', new Date('2026-05-01T11:04:00Z'), new Date('2026-05-01T12:00:00Z')))
      .rejects.toThrow(ConflictException);
  });
});
