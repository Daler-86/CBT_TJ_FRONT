import { Injectable } from '@angular/core';
import { InstallmentParams, InstallmentResult, RateTier } from '../models/calculate.model';

@Injectable({
  providedIn: 'root',
})
export class InstallmentService {
  private readonly rateTiers: RateTier[] = [
    { term: 3, annualRate: 0.04 },
    { term: 6, annualRate: 0.07 },
    { term: 9, annualRate: 0.1 },  
    { term: 12, annualRate: 0.13 }, 
    { term: 18, annualRate: 0.2 }, 
  ];

  private readonly conditions = {
    minAmount: 1000,
    maxAmount: 20000,
    minTerm: 3,
    maxTerm: 18,
  };

  getConditions() {
    return this.conditions;
  }

  getAvailableTerms(): number[] {
    return this.rateTiers.map((tier) => tier.term);
  }

  private findRateForTerm(term: number): number {
    const matchedTier = this.rateTiers.find((tier) => tier.term === term);
    return matchedTier ? matchedTier.annualRate : 0;
  }

  calculate(params: InstallmentParams): InstallmentResult | null {
    const rate = this.findRateForTerm(params.term);
    
    if (params.amount <= 0 || params.term <= 0) {
      return null;
    }

    const interestValue = params.amount * rate;
    const totalPayment = params.amount + interestValue;

    const monthlyPayment = totalPayment / params.term;

    return {
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      interestRate: rate,
    };
  }
}