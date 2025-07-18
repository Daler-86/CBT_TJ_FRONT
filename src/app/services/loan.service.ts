import { Injectable } from '@angular/core';
import { LoanCalculationParams, LoanCalculationResult, LoanConditions, LoanProduct } from '../models/calculate.model';
interface LoanCurrencyConditions {
  minAmount: number;
  maxAmount: number;
  stepAmount: number;
  minTerm: number;
  maxTerm: number;
}

@Injectable({
  providedIn: 'root'
})

export class LoanService {

 // --- Условия для калькулятора, зависящие от валюты ---
 private readonly conditions: { [currency: string]: LoanCurrencyConditions } = {
  'TJS': {
    minAmount: 1000,
    maxAmount: 100000,
    stepAmount: 1000,
    minTerm: 3,
    maxTerm: 36,
  },
  'USD': {
    minAmount: 100,
    maxAmount: 10000,
    stepAmount: 100,
    minTerm: 3,
    maxTerm: 36,
  }
};

constructor() { }

// Метод для получения условий (лимитов) для выбранной валюты
getConditions(currency: 'TJS' | 'USD'): LoanCurrencyConditions {
  return this.conditions[currency];
}

// Метод для выполнения расчетов
calculate(params: LoanCalculationParams): LoanCalculationResult {
  const loanAmount = params.amount;
  const monthlyRate = params.annualRate / 12;
  const numberOfPayments = params.term;

  if (monthlyRate === 0) {
    const monthlyPayment = loanAmount > 0 && numberOfPayments > 0 ? loanAmount / numberOfPayments : 0;
    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: loanAmount,
      totalOverpayment: 0,
      interestRate: 0,
    };
  }

  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalPayment = monthlyPayment * numberOfPayments;
  const totalOverpayment = totalPayment - loanAmount;

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalOverpayment: Math.round(totalOverpayment),
    interestRate: params.annualRate,
  };
}
}
