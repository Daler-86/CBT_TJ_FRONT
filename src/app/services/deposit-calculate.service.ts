import { Injectable } from '@angular/core';
import { CalculationParams, CalculationResult, DepositProducts } from '../models/deposit.model';

@Injectable({
  providedIn: 'root'
})
export class DepositCalculateService {
  private readonly DEPOSIT_PRODUCTS: DepositProducts = {
    "2": {
        name: "DEPOSIT_PRODUCTS.FAVRI",
        currencies: {
            "TJS": { 
                minAmount: 1000, maxAmount: 10000000, stepAmount: 1000, amountLabels: ['1 тыс.', '25 тыс.', '50 тыс.', '75 тыс.', '∞'],
                minTerm: 6, maxTerm: 48, stepTerm: 1, termLabels: ['6 мес.', '18 мес.', '36 мес.', '48 мес.'],
                rates: [{ minMonths: 13, rate: 0.11 }, { minMonths: 12, rate: 0.09 }, { minMonths: 9, rate: 0.07 }, { minMonths: 6, rate: 0.05 }] 
            },
            "USD": {
                minAmount: 100, maxAmount: 10000000, stepAmount: 100, amountLabels: ['$100', '$2.5k', '$5k', '$7.5k', '∞' ],
                minTerm: 6, maxTerm: 48, stepTerm: 1, termLabels: ['6 мес.', '18 мес.', '36 мес.', '48 мес.'],
                rates: [{ minMonths: 13, rate: 0.05 }, { minMonths: 12, rate: 0.04 }, { minMonths: 9, rate: 0.02 }, { minMonths: 6, rate: 0.01 }] 
            }
        }
    },
    "1": {
        name: "DEPOSIT_PRODUCTS.DURAKHSHON",

        currencies: {
            "TJS": {
                minAmount: 500, maxAmount: 10000000, stepAmount: 500, amountLabels: ['500', '10 тыс.', '25 тыс.', '∞'],
                minTerm: 12, maxTerm: 72, stepTerm: 1, termLabels: ['1 год', '3 года', '5 лет', '6 лет'],
                rates: [{ minMonths: 25, rate: 0.11 }, { minMonths: 24, rate: 0.10 }, { minMonths: 12, rate: 0.09 }]
            },
            "USD": {
                minAmount: 50, maxAmount: 10000000, stepAmount: 50, amountLabels: ['$50', '$1k', '$2.5k', '∞'],
                minTerm: 12, maxTerm: 72, stepTerm: 1, termLabels: ['1 год', '3 года', '5 лет', '6 лет'],
                rates: [{ minMonths: 25, rate: 0.07 }, { minMonths: 24, rate: 0.05 }, { minMonths: 12, rate: 0.04 }]
            }
        }
    },
    "4": {
        name: "DEPOSIT_PRODUCTS.ORZU",
        currencies: {
            "TJS": {
                minAmount: 1000, maxAmount: 10000000, stepAmount: 500, amountLabels: ['1 тыс.', '10 тыс.', '25 тыс.', '∞'],
                minTerm: 6, maxTerm: 12, stepTerm: 1, termLabels: ['6 мес.', '9 мес.', '12 мес.'],
                rates: [{ minMonths: 12, rate: 0.09 }, { minMonths: 9, rate: 0.06 }, { minMonths: 6, rate: 0.04 }]
            },
            "USD": null
        }
    },
    "3": {
        name: "DEPOSIT_PRODUCTS.VIP",
        currencies: {
            "TJS": {
                minAmount: 500000, maxAmount: 10000000, stepAmount: 10000, amountLabels: ['500 тыс.', '1.5 млн', '3 млн', '∞'],
                minTerm: 12, maxTerm: 60, stepTerm: 1, termLabels: ['1 год', '2 года', '3 года', '5 лет'],
                rates: [{ minMonths: 37, rate: 0.12 }, { minMonths: 24, rate: 0.11 }, { minMonths: 12, rate: 0.10 }]
            },
            "USD": {
                minAmount: 100000, maxAmount: 10000000, stepAmount: 5000, amountLabels: ['$100k', '$250k', '$500k', '∞'],
                minTerm: 12, maxTerm: 60, stepTerm: 1, termLabels: ['1 год', '2 года', '3 года', '5 лет'],
                rates: [{ minMonths: 37, rate: 0.08 }, { minMonths: 24, rate: 0.07 }, { minMonths: 12, rate: 0.06 }]
            }
        }
    },
    "5": {
        name: "DEPOSIT_PRODUCTS.AVF",
        currencies: {
            "TJS": {
                minAmount: 1000, maxAmount:10000000, stepAmount: 1000, amountLabels: ['1 тыс.', '250 тыс.', '500 тыс.', '∞'],
                minTerm: 12, maxTerm: 36, stepTerm: 1, termLabels: ['1 год', '1.5 года', '2.5 года', '3 года'],
                rates: [{ minMonths: 24, rate: 0.11 }, { minMonths: 12, rate: 0.10 }]
            },
            "USD": {
                minAmount: 100, maxAmount:10000000, stepAmount: 100, amountLabels: ['$100', '$25k', '$50k', '∞'],
                minTerm: 12, maxTerm: 36, stepTerm: 1, termLabels: ['1 год', '1.5 года', '2.5 года', '3 года'],
                rates: [{ minMonths: 24, rate: 0.07 }, { minMonths: 12, rate: 0.06 }]
            }
        }
    }
  };

  getProductsData(): DepositProducts {
    return this.DEPOSIT_PRODUCTS;
  }
  
  getProductConditions(productId: string, currency: 'TJS' | 'USD') {
    return this.DEPOSIT_PRODUCTS[productId]?.currencies[currency];
  }

  calculateDeposit(params: CalculationParams): CalculationResult {
    const product = this.DEPOSIT_PRODUCTS[params.productId];
    if (!product) {
      return { productName: "Неизвестный продукт", rate: 0, income: 0, totalAmount: params.amount, error: `Продукт с ID ${params.productId} не найден` };
    }

    const conditions = product.currencies[params.currency];
    const productName = product.name;

    if (!conditions) {
      return { productName, rate: 0, income: 0, totalAmount: params.amount, error: `Продукт недоступен в ${params.currency}` };
    }
    if (params.amount < conditions.minAmount) {
      return { productName, rate: 0, income: 0, totalAmount: params.amount, error: `Мин. сумма: ${new Intl.NumberFormat('ru-RU').format(conditions.minAmount)} ${params.currency}` };
    }
    if (params.termMonths < conditions.minTerm) {
      return { productName, rate: 0, income: 0, totalAmount: params.amount, error: `Мин. срок: ${conditions.minTerm} мес.` };
    }

    let annualRate = 0;
    const sortedRates = [...conditions.rates].sort((a, b) => b.minMonths - a.minMonths);
    for (const tier of sortedRates) {
      if (params.termMonths >= tier.minMonths) {
        annualRate = tier.rate;
        break;
      }
    }
   
   // 1. Сначала считаем точный доход
   const preciseIncome = params.amount * annualRate * (params.termMonths / 12);
    
   // 2. Округляем доход до ближайшего целого числа
   const roundedIncome = Math.round(preciseIncome);

   // 3. Считаем итоговую сумму, используя уже округленный доход
   const totalAmount = params.amount + roundedIncome;

   // 4. Возвращаем красивые округленные значения
   return { 
     productName, 
     rate: annualRate, 
     income: roundedIncome, 
     totalAmount: totalAmount 
   };
 
  }
}
