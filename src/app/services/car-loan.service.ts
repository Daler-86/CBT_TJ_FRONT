import { Injectable } from '@angular/core';
import { AutoLoanParams, AutoLoanResult, CarLoanConditions, CarLoanParams, CarLoanResult } from '../models/calculate.model';
export interface AutoLoanConditions {
  minCarCost: number;
  maxCarCost: number;
  minDownPaymentPercent: number; // Предоплата в % (например, 0.2 для 20%)
  minTerm: number;
  maxTerm: number;
  minRate: number; // Ставка в %
  maxRate: number;
}


@Injectable({
  providedIn: 'root'
})
// export class CarLoanService {

//   // --- Новые, точные условия из вашего скриншота ---
//   private conditions: { [key: string]: CarLoanConditions } = {
//     'TJS': {
//       annualRate: 0.25, // Берем максимальную ставку из диапазона 20-25%
//       minCarCost: 50000,
//       maxCarCost: 300000,
//       stepCarCost: 1000,
//       costLabels: ['50 тыс.', '175 тыс.', '300 тыс.'],
//         minDownPaymentPercent: 0.20,
//       minTerm: 12,
//       maxTerm: 36,
//       stepTerm: 1,
//       termLabels: ['12 мес', '24 мес', '36 мес'],
//     },
//     'USD': {
//       annualRate: 0.15, // Берем максимальную ставку из диапазона 13-15%
//       // Задаем адекватные лимиты для USD
//       minCarCost: 5000,
//       maxCarCost: 30000,
//       stepCarCost: 100,
//       costLabels: ['$5k', '$17.5k', '$30k'],
//       minDownPaymentPercent: 0.20, // Предоплата может быть от 0%
//       minTerm: 12,
//       maxTerm: 36,
//       stepTerm: 1,
//       termLabels: ['12 мес', '24 мес', '36 мес'],
//     }
//   };

//   constructor() { }

//   getConditions(currency: 'TJS' | 'USD'): CarLoanConditions {
//     return this.conditions[currency];
//   }

//   calculate(params: CarLoanParams): CarLoanResult {
//     const loanAmount = params.carCost - params.downPayment;

//     // Проверка, если сумма кредита отрицательная или нулевая
//     if (loanAmount <= 0) {
//       return { 
//         monthlyPayment: 0, 
//         totalOverpayment: 0, 
//         interestRate: this.conditions[params.currency].annualRate 
//       };
      
//     }
    

//     const conditions = this.getConditions(params.currency);
    
//     const monthlyRate = conditions.annualRate / 12;
//     const numberOfPayments = params.term;

//     // Классическая формула аннуитетного платежа
//     const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
//     const totalPayment = monthlyPayment * numberOfPayments;
//     const totalOverpayment = totalPayment - loanAmount;

//     return {
//       monthlyPayment: Math.round(monthlyPayment),
//       totalOverpayment: Math.round(totalOverpayment),
//       interestRate: conditions.annualRate,
//     };
//   }
// }
export class CarLoanService{
  private readonly conditions: { [currency: string]: AutoLoanConditions } = {
    'tjs': {
      minCarCost: 50000,
      maxCarCost: 300000,
      minDownPaymentPercent: 0.20,
      minTerm: 12,
      maxTerm: 36,
      minRate: 20,
      maxRate: 25,
    },
    'usd': {
      minCarCost: 5000,
      maxCarCost: 30000,
      minDownPaymentPercent: 0.20,
      minTerm: 12,
      maxTerm: 48,
      minRate: 13,
      maxRate: 15,
    }
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
    
    if(monthlyRate === 0 || params.term === 0) {
      const monthlyPayment = params.term > 0 ? financingAmount / params.term : 0;
      return { 
        monthlyPayment: Math.round(monthlyPayment),
        totalOverpayment: 0,
        financingAmount
      };
    }

    const monthlyPayment = financingAmount * (monthlyRate * Math.pow(1 + monthlyRate, params.term)) / (Math.pow(1 + monthlyRate, params.term) - 1);
    const totalPayment = monthlyPayment * params.term;
    const totalOverpayment = totalPayment - financingAmount;

    return {
      monthlyPayment: monthlyPayment,
      totalOverpayment: totalOverpayment,
      financingAmount: financingAmount
    };
  }
}