import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { Space } from './space.entity';
import { Reservation } from './reservation.entity';

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  async createSpace(@Body() spaceData: Partial<Space>): Promise<Space> {
    return this.spacesService.createSpace(spaceData);
  }

  @Get()
  async getSpaces(): Promise<Space[]> {
    return this.spacesService.getSpaces();
  }

  @Post(':id/reservations')
  async reserveSpace(
    @Param('id') spaceId: string,
    @Body() body: { userId: string; startTime: string; endTime: string }
  ): Promise<Reservation> {
    const startTime = new Date(body.startTime);
    const endTime = new Date(body.endTime);
    return this.spacesService.reserveSpace(spaceId, body.userId, startTime, endTime);
  }
}
