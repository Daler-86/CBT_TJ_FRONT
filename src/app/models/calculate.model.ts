// src/app/models/installment.model.ts

// Уровень ставки: срок и соответствующая годовая ставка
export interface RateTier {
    term: number; // Срок в месяцах
    annualRate: number; // Годовая ставка в десятичном формате (например, 0.04 для 4%)
  }
  
  // Параметры для расчета
  export interface InstallmentParams {
    amount: number;
    term: number;
  }
  
  // Результаты расчета
  export interface InstallmentResult {
    monthlyPayment: number;
    totalPayment: number;
    interestRate: number; // Фактическая ставка для данного срока
  }
  // src/app/models/car-loan.model.ts

// Условия для конкретной валюты
export interface CarLoanConditions {
    annualRate: number; // Годовая ставка, например 0.25 для 25%
    // Лимиты для стоимости авто
    minCarCost: number;
    maxCarCost: number;
    stepCarCost: number;
    costLabels: string[];
    // Лимиты для предоплаты (могут быть % от стоимости)
    minDownPaymentPercent: number; // например, 0.2 для 20%
    // Лимиты для срока кредита
    minTerm: number;
    maxTerm: number;
    stepTerm: number;
    termLabels: string[];
  }
  
  // Параметры для расчета
  export interface CarLoanParams {
    carCost: number;
    downPayment: number;
    term: number;
    currency: 'TJS' | 'USD';
  }
  
  // Результаты расчета
  export interface CarLoanResult {
    monthlyPayment: number;
    totalOverpayment: number;
    interestRate: number;
  }
  // src/app/models/loan.model.ts

// Условия для конкретной валюты и типа клиента
export interface LoanConditions {
    // Диапазон ставок (берем максимальную для расчета)
    rate: number; 
    minAmount: number;
    maxAmount: number;
    minTerm: number;
    maxTerm: number;
  }
  
  // Описывает один кредитный продукт
  export interface LoanProduct {
    name: string;
    // Доступные типы клиентов (если есть)
    clientTypes?: string[];
    currencies: {
      [currency: string]: { // TJS или USD
        [clientType: string]: LoanConditions; // "Новый", "Повторный" или "default"
      }
    };
  }
  
 

  export interface LoanCalculationParams {
    amount: number;
    term: number;
    annualRate: number; // Годовая ставка в десятичном формате (например, 0.16)
  }
  
  // Результаты расчета
  export interface LoanCalculationResult {
    monthlyPayment: number;
    totalPayment: number;
    totalOverpayment: number;
    interestRate: number; // Фактическая ставка для данного расчета
  }
  export interface CalculatorData {
    id: number;
    credit_id: number;
    currency: 'tjs' | 'usd';
    min_percentage: number;
    max_percentage: number;
    min_amount: number;
    max_amount: number;
    min_month: number;
    max_month: number;
  }