import { BaseRule, ReservationContext } from '../interfaces/rule.interface';

export class UndergradLimitRule extends BaseRule {
  protected process(context: ReservationContext): void {
    if (context.role === 'undergrad' && context.requestedHours > 2) {
      context.isAllowed = false;
      context.rejectReason = 'Undergraduates are limited to 2 hours per reservation.';
    }
  }
}
