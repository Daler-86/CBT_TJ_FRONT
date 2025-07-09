import { Injectable } from '@angular/core';
import { InstallmentParams, InstallmentResult, RateTier } from '../models/calculate.model';

@Injectable({
  providedIn: 'root'
})
export class InstallmentService {

  private readonly rateTiers: RateTier[] = [
    { term: 3,  annualRate: 0.04 }, // 4% - 3 месяца
    { term: 6,  annualRate: 0.07 }, // 7% - 6 месяцев
    { term: 9,  annualRate: 0.10 }, // 10% - 9 месяцев
    { term: 12, annualRate: 0.13 }, // 13% - 12 месяцев
    { term: 18, annualRate: 0.20 }  // 20% - 18 месяцев
  ];

  // --- Общие условия ---
  private readonly conditions = {
    minAmount: 1000,
    maxAmount: 20000, // Максимальная сумма с поручителем
    minTerm: 3,
    maxTerm: 18,
  };

  constructor() { }

  getConditions() {
    return this.conditions;
  }
  
  // Получаем доступные сроки для слайдера (3, 6, 9, 12, 18)
  getAvailableTerms(): number[] {
    return this.rateTiers.map(tier => tier.term);
  }

  /**
   * Находит подходящую ставку для выбранного срока
   */
  private findRateForTerm(term: number): number {
    // Ищем точное совпадение срока
    const matchedTier = this.rateTiers.find(tier => tier.term === term);
    // Если для выбранного срока нет ставки, можно вернуть 0 или какую-то базовую ставку
    return matchedTier ? matchedTier.annualRate : 0;
  }

  /**
   * Главный метод расчета
   */
  calculate(params: InstallmentParams): InstallmentResult | null {
    const annualRate = this.findRateForTerm(params.term);
    if (annualRate === 0) {
      // Это означает, что для выбранного срока (например, 7 месяцев) нет тарифа
      return null; 
    }

    const monthlyRate = annualRate / 12;
    const numberOfPayments = params.term;

    const monthlyPayment = params.amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      interestRate: annualRate,
    };
  }
}
