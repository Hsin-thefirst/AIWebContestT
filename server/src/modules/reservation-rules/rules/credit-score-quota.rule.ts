import { BaseRule, ReservationContext } from '../interfaces/rule.interface';

export class CreditScoreQuotaRule extends BaseRule {
  protected process(context: ReservationContext): void {
    if (context.creditScore < 80) {
      context.currentQuota = Math.floor(context.currentQuota / 2);
    }

    if (context.requestedHours > context.currentQuota) {
      context.isAllowed = false;
      context.rejectReason = 'Requested hours exceed available quota due to low credit score penalty.';
    }
  }
}
