import { Module } from '@nestjs/common';
import { ReservationRuleEngineService } from './reservation-rule-engine.service';

@Module({
  providers: [ReservationRuleEngineService],
  exports: [ReservationRuleEngineService],
})
export class ReservationRulesModule {}
