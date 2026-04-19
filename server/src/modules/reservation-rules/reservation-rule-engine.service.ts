import { Injectable } from '@nestjs/common';
import { ReservationContext, ReservationRule } from './interfaces/rule.interface';
import { UndergradLimitRule } from './rules/undergrad-limit.rule';
import { CreditScoreQuotaRule } from './rules/credit-score-quota.rule';
import { NoShowPenaltyRule } from './rules/no-show-penalty.rule';

@Injectable()
export class ReservationRuleEngineService {
  
  private buildChain(): ReservationRule {
    const undergradRule = new UndergradLimitRule();
    const creditScoreRule = new CreditScoreQuotaRule();
    const noShowRule = new NoShowPenaltyRule();

    undergradRule
      .setNext(creditScoreRule)
      .setNext(noShowRule);

    return undergradRule;
  }

  evaluateReservation(context: Omit<ReservationContext, 'isAllowed' | 'currentQuota' | 'pointsToDeductOnNoShow'>): ReservationContext {
    const evaluationContext: ReservationContext = {
      ...context,
      isAllowed: true,
      currentQuota: context.baseQuota,
      pointsToDeductOnNoShow: 0,
    };

    const ruleChain = this.buildChain();
    ruleChain.execute(evaluationContext);

    return evaluationContext;
  }
}
