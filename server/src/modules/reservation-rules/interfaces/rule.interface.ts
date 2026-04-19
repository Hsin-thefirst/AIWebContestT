export interface ReservationContext {
  userId: string;
  role: 'undergrad' | 'postgrad' | 'faculty';
  creditScore: number;
  requestedHours: number;
  baseQuota: number;
  currentQuota: number;
  noShowHistoryCount: number;
  isAllowed: boolean;
  rejectReason?: string;
  pointsToDeductOnNoShow: number;
}

export interface ReservationRule {
  setNext(rule: ReservationRule): ReservationRule;
  execute(context: ReservationContext): void;
}

export abstract class BaseRule implements ReservationRule {
  private nextRule: ReservationRule;

  setNext(rule: ReservationRule): ReservationRule {
    this.nextRule = rule;
    return rule;
  }

  execute(context: ReservationContext): void {
    this.process(context);
    
    if (!context.isAllowed) {
      return; 
    }
    
    if (this.nextRule) {
      this.nextRule.execute(context);
    }
  }

  protected abstract process(context: ReservationContext): void;
}
