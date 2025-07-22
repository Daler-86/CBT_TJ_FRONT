import { Injectable } from '@angular/core';
import { LoanCalculationParams, LoanCalculationResult, LoanConditions, LoanProduct } from '../models/calculate.model';
export interface DefaultLoanConditions {
  minAmount: number; maxAmount: number;
  minTerm: number; maxTerm: number;
  minRate: number; maxRate: number;
}
@Injectable({
  providedIn: 'root'
})

export class LoanService {
  private readonly conditions: { [key in 'TJS' | 'USD']: DefaultLoanConditions } = {
    'TJS': { minAmount: 1000, maxAmount: 100000, minTerm: 3, maxTerm: 36, minRate: 16, maxRate: 30 },
    'USD': { minAmount: 100, maxAmount: 10000, minTerm: 3, maxTerm: 36, minRate: 12, maxRate: 22 }
  };

  getConditions(currency: 'TJS' | 'USD'): DefaultLoanConditions {
    return this.conditions[currency];
  }

  calculate(params: { amount: number, term: number, annualRate: number }): LoanCalculationResult {
    const loanAmount = params.amount;
    const monthlyRate = params.annualRate / 12;
    const numberOfPayments = params.term;

    if (loanAmount <= 0 || numberOfPayments <= 0 || monthlyRate <= 0) {
      return { monthlyPayment: 0, totalPayment: loanAmount, totalOverpayment: 0, interestRate: params.annualRate };
    }

    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = payment * numberOfPayments;
    
    return {
      monthlyPayment: Math.round(payment),
      totalPayment: Math.round(totalPayment),
      totalOverpayment: Math.round(totalPayment - loanAmount),
      interestRate: params.annualRate,
    };
  }
}
