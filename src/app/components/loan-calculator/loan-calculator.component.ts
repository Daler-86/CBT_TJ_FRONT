import { Component, OnInit, inject,OnChanges, Input , SimpleChanges  } from '@angular/core';
import { CalculatorData, LoanCalculationResult } from '../../models/calculate.model';
import { LoanService } from '../../services/loan.service';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Currency = 'tjs' | 'usd';
@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports:  [CommonModule, FormsModule, CurrencyPipe, PercentPipe],
  templateUrl: './loan-calculator.component.html',
  styleUrl: './loan-calculator.component.scss'
})
export class LoanCalculatorComponent implements OnChanges{
   
  // @Input ожидает массив с условиями
  @Input() conditionsData: CalculatorData[] = [];
  
  // Состояние формы
  loanAmount: any = 0;
  loanTerm: number = 0;
  interestRatePercent: number = 0;
  
  // UI-настройки
  selectedCurrency: Currency = 'tjs';
  currentConditions: CalculatorData | null = null;
  availableCurrencies: Currency[] = [];
  
  minAmount = 0; maxAmount = 0; stepAmount = 100;
  minTerm = 0; maxTerm = 0; stepTerm = 1;
  minRate = 0; maxRate = 0;
  
  amountLabels: string[] = [];
  termLabels: string[] = [];
  rateLabels: string[] = [];
  
  loanAmountPercent = '0%';
  loanTermPercent = '0%';
  ratePercent = '0%';

  calculationResult: LoanCalculationResult | null = null;
  
  // Срабатывает, когда родитель передает [conditionsData]
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conditionsData'] && this.conditionsData?.length > 0) {
      this.availableCurrencies = this.conditionsData.map(c => c.currency);
      this.selectCurrency(this.availableCurrencies[0] || 'tjs');
    }
  }

  // Вызывается по клику на кнопку валюты
  selectCurrency(currency: Currency): void {
    this.selectedCurrency = currency;
    this.currentConditions = this.conditionsData.find(c => c.currency === currency) || null;
    this.initializeCalculator();
  }

  // Настраивает все лимиты и начальные значения
  initializeCalculator(): void {
    if (!this.currentConditions) return;
    
    this.minAmount = this.currentConditions.min_amount;
    this.maxAmount = this.currentConditions.max_amount;
    this.stepAmount = Math.round((this.maxAmount - this.minAmount) / 100);
    
    this.minTerm = this.currentConditions.min_month;
    this.maxTerm = this.currentConditions.max_month;
    
    this.minRate = this.currentConditions.min_percentage;
    this.maxRate = this.currentConditions.max_percentage;

    this.loanAmount = this.minAmount;
    this.loanTerm = this.minTerm;
    this.interestRatePercent = this.minRate;

    this.amountLabels = [`${this.minAmount}`, `${this.maxAmount}`];
    this.termLabels = [`${this.minTerm} мес.`, `${this.maxTerm} мес.`];
    this.rateLabels = [`${this.minRate}%`, `${this.maxRate}%`];
    this.recalculate();
  }

  // Центральный метод для расчетов и валидации
  recalculate(): void {
    if (!this.currentConditions) return;

    let numericAmount = parseInt(String(this.loanAmount).replace(/\D/g, ''));
    if (isNaN(numericAmount) || numericAmount < this.minAmount) { numericAmount = this.minAmount; }
    if (numericAmount > this.maxAmount) { numericAmount = this.maxAmount; }
    this.loanAmount = numericAmount;

    this.loanTerm = Math.max(this.minTerm, Math.min(this.loanTerm, this.maxTerm));
    this.interestRatePercent = Math.max(this.minRate, Math.min(this.interestRatePercent, this.maxRate));

    const annualRate = this.interestRatePercent / 100;
    const monthlyRate = annualRate / 12;

    if (this.loanAmount > 0 && this.loanTerm > 0 && monthlyRate > 0) {
        const monthlyPayment = this.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, this.loanTerm)) / (Math.pow(1 + monthlyRate, this.loanTerm) - 1);
        const totalPayment = monthlyPayment * this.loanTerm;
        this.calculationResult = {
            monthlyPayment: Math.round(monthlyPayment),
            totalPayment: Math.round(totalPayment),
            totalOverpayment: Math.round(totalPayment - this.loanAmount),
            interestRate: annualRate,
        };
    } else {
        this.calculationResult = null;
    }
    this.updateVisuals();
  }
  
  updateVisuals(): void {
    this.loanAmountPercent = (this.maxAmount > this.minAmount) ? `${((this.loanAmount - this.minAmount) / (this.maxAmount - this.minAmount)) * 100}%` : '0%';
    this.loanTermPercent = (this.maxTerm > this.minTerm) ? `${((this.loanTerm - this.minTerm) / (this.maxTerm - this.minTerm)) * 100}%` : '0%';
    this.ratePercent = (this.maxRate > this.minRate) ? `${((this.interestRatePercent - this.minRate) / (this.maxRate - this.minRate)) * 100}%` : '0%';
  }
}
