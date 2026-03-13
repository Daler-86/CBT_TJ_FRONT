import { Injectable } from '@angular/core';
import { AutoLoanParams, AutoLoanResult } from '../models/calculate.model';
export interface AutoLoanConditions {
  minCarCost: number;
  maxCarCost: number;
  minDownPaymentPercent: number; 
  minTerm: number;
  maxTerm: number;
  minRate: number; 
  maxRate: number;
}

@Injectable({
  providedIn: 'root',
})

export class CarLoanService {
  private readonly conditions: Record<string, AutoLoanConditions> = {
    tjs: {
      minCarCost: 50000,
      maxCarCost: 300000,
      minDownPaymentPercent: 0.2,
      minTerm: 12,
      maxTerm: 36,
      minRate: 20,
      maxRate: 25,
    },
    usd: {
      minCarCost: 5000,
      maxCarCost: 30000,
      minDownPaymentPercent: 0.2,
      minTerm: 12,
      maxTerm: 48,
      minRate: 13,
      maxRate: 15,
    },
  };

  getConditions(currency: 'tjs' | 'usd'): AutoLoanConditions {
    return this.conditions[currency];
  }

  calculate(params: AutoLoanParams): AutoLoanResult {
    const financingAmount = params.carCost - params.downPayment;
    if (financingAmount <= 0) {
      return { monthlyPayment: 0, totalOverpayment: -financingAmount, financingAmount: 0 };
    }

    const monthlyRate = params.annualRate / 12;

    if (monthlyRate === 0 || params.term === 0) {
      const monthlyPayment = params.term > 0 ? financingAmount / params.term : 0;
      return {
        monthlyPayment: Math.round(monthlyPayment),
        totalOverpayment: 0,
        financingAmount,
      };
    }

    const monthlyPayment =
      (financingAmount * (monthlyRate * Math.pow(1 + monthlyRate, params.term))) /
      (Math.pow(1 + monthlyRate, params.term) - 1);
    const totalPayment = monthlyPayment * params.term;
    const totalOverpayment = totalPayment - financingAmount;

    return {
      monthlyPayment: monthlyPayment,
      totalOverpayment: totalOverpayment,
      financingAmount: financingAmount,
    };
  }
}
