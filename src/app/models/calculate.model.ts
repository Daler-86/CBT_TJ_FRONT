
export interface RateTier {
  term: number; 
  annualRate: number; 
}


export interface InstallmentParams {
  amount: number;
  term: number;
}


export interface InstallmentResult {
  monthlyPayment: number;
  totalPayment: number;
  interestRate: number; 
}

export interface CarLoanConditions {
  annualRate: number; 
  minCarCost: number;
  maxCarCost: number;
  stepCarCost: number;
  costLabels: string[];
  minDownPaymentPercent: number; 
  minTerm: number;
  maxTerm: number;
  stepTerm: number;
  termLabels: string[];
}

export interface CarLoanParams {
  carCost: number;
  downPayment: number;
  term: number;
  currency: 'TJS' | 'USD';
  annualRate: number;
}

export interface CarLoanResult {
  monthlyPayment: number;
  totalOverpayment: number;
  interestRate: number;
}

export interface LoanConditions {
  rate: number;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
}


export interface LoanProduct {
  name: string;
  clientTypes?: string[];
  currencies: Record<string, Record<string, LoanConditions>>;
}

export interface LoanCalculationParams {
  amount: number;
  term: number;
  annualRate: number; 
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalOverpayment: number;
  interestRate: number;
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
export interface AutoLoanConditions {
  min_amount: number;
  max_amount: number;
  min_month: number;
  max_month: number;
  min_percentage: number;
  max_percentage: number;
  min_down_payment_percent: number; 
}

export interface AutoLoanParams {
  carCost: number;
  downPayment: number;
  term: number;
  annualRate: number;
}

export interface AutoLoanResult {
  monthlyPayment: number;
  totalOverpayment: number;
  financingAmount: number;
}
export interface LoanConditionsData {
  currency: 'tjs' | 'usd';
  min_percentage: number;
  max_percentage: number;
  min_amount: number;
  max_amount: number;
  min_month: number;
  max_month: number;
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalOverpayment: number;
  interestRate: number; 
}
