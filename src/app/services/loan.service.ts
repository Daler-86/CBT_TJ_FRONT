import { Injectable } from '@angular/core';
import { LoanCalculationParams, LoanCalculationResult, LoanConditions, LoanProduct } from '../models/calculate.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {


  private readonly loanProducts: { [key: string]: LoanProduct } = {
    'barakat': {
      name: 'Кредит «Баракат»',
      clientTypes: ['Новый клиент', 'Повторный клиент', 'Зарплатный клиент'],
      currencies: {
        'TJS': {
          'Новый клиент':     { rate: 0.25, minAmount: 1000, maxAmount: 30000, minTerm: 3, maxTerm: 36 },
          'Повторный клиент':  { rate: 0.24, minAmount: 1000, maxAmount: 30000, minTerm: 3, maxTerm: 36 },
          'Зарплатный клиент': { rate: 0.22, minAmount: 1000, maxAmount: 30000, minTerm: 3, maxTerm: 36 },
        },
        'USD': {
          'Новый клиент':     { rate: 0.16, minAmount: 100, maxAmount: 3000, minTerm: 3, maxTerm: 36 },
          'Повторный клиент':  { rate: 0.15, minAmount: 100, maxAmount: 3000, minTerm: 3, maxTerm: 36 },
          'Зарплатный клиент': { rate: 0.15, minAmount: 100, maxAmount: 3000, minTerm: 3, maxTerm: 36 },
        }
      }
    },
    'foidanok': {
      name: 'Кредит «Фоиданок»',
      currencies: {
        'TJS': {
          'default': { rate: 0.18, minAmount: 1000, maxAmount: 500000, minTerm: 3, maxTerm: 36 }
        }
      }
    },
    'zoloto': {
        name: 'Кредит «Золото»',
        currencies: {
          'TJS': {
            'default': { rate: 0.22, minAmount: 1000, maxAmount: 3000000, minTerm: 3, maxTerm: 36 }
          },
          'USD': {
            'default': { rate: 0.13, minAmount: 100, maxAmount: 300000, minTerm: 3, maxTerm: 36 }
          }
        }
    },
    'teachers': {
        name: 'Кредит «Врачи и преподаватели»',
        currencies: {
            'TJS': {
                'default': { rate: 0.24, minAmount: 1000, maxAmount: 25000, minTerm: 3, maxTerm: 24 }
            }
        }
    },
    'intikol': {
        name: 'Кредит «Интиқол»',
        currencies: {
            'TJS': {
                'default': { rate: 0.26, minAmount: 1000, maxAmount: 10000, minTerm: 3, maxTerm: 24 }
            }
        }
    },
    // Продукты с 0% или особыми условиями пока не подходят для аннуитетного калькулятора
    // 'dastras': { name: 'Кредит «Дастрас»' ... },
    // 'favri': { name: 'Кредит «Фаврӣ (овердрафт)»' ... }
  };

  constructor() { }

  getProducts() {
    return this.loanProducts;
  }
  
  getConditions(productId: string, currency: 'TJS' | 'USD', clientType: string): LoanConditions | null {
      const product = this.loanProducts[productId];
      if (!product || !product.currencies[currency]) return null;
      
      const conditions = product.currencies[currency][clientType] || product.currencies[currency]['default'];
      return conditions || null;
  }

  calculate(params: LoanCalculationParams): LoanCalculationResult | null {
    const conditions = this.getConditions(params.productId, params.currency, params.clientType);
    if (!conditions) {
      return { monthlyPayment: 0, totalPayment: 0, totalOverpayment: 0, interestRate: 0, error: 'Условия не найдены' };
    }

    if (params.amount < conditions.minAmount || params.amount > conditions.maxAmount) {
      return { monthlyPayment: 0, totalPayment: 0, totalOverpayment: 0, interestRate: conditions.rate, error: `Сумма от ${conditions.minAmount} до ${conditions.maxAmount}` };
    }

    const loanAmount = params.amount;
    const monthlyRate = conditions.rate / 12;
    const numberOfPayments = params.term;

    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalOverpayment = totalPayment - loanAmount;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalOverpayment: Math.round(totalOverpayment),
      interestRate: conditions.rate,
    };
  }
}
