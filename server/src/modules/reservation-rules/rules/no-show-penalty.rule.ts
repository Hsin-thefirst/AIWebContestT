import { BaseRule, ReservationContext } from '../interfaces/rule.interface';

export class NoShowPenaltyRule extends BaseRule {
  protected process(context: ReservationContext): void {
    if (context.noShowHistoryCount > 0) {
      context.pointsToDeductOnNoShow = 10;
    }
  }
}
