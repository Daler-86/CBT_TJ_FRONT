import { Component, OnInit, inject,OnChanges, Input , SimpleChanges  } from '@angular/core';
import { CalculatorData, LoanCalculationResult, LoanConditionsData } from '../../models/calculate.model';
import { LoanService } from '../../services/loan.service';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollToDirective } from '../../directives/scroll-to.directive';
import { ScrollService } from '../../services/scroll.service';
import { TranslateModule } from '@ngx-translate/core';
type Currency = 'tjs' | 'usd';
@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports:  [CommonModule, FormsModule, CurrencyPipe, PercentPipe,ScrollToDirective, TranslateModule],
  templateUrl: './loan-calculator.component.html',
  styleUrl: './loan-calculator.component.scss'
})
export class LoanCalculatorComponent implements OnChanges{
  @Input() conditionsData?: LoanConditionsData[];
  @Input() showApplyButton: boolean = false;
  loanAmount: any = 0;
  loanTerm: number = 0;
  interestRatePercent: number = 0;
  
  selectedCurrency: Currency = 'tjs';
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
  isEditingAmount: boolean = false;
  
  constructor(private loanService: LoanService, private scrollService:ScrollService) {}

  ngOnInit(): void {
    if (!this.conditionsData) {
      this.setupOrUpdate();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conditionsData']) {
      this.setupOrUpdate();
    }
  }

  setupOrUpdate(): void {
    if (this.conditionsData && this.conditionsData.length > 0) {
      // РЕЖИМ ПРОДУКТА
      this.availableCurrencies = this.conditionsData.map(c => c.currency);
      if(!this.availableCurrencies.includes(this.selectedCurrency)) {
        this.selectedCurrency = this.availableCurrencies[0];
      }
      const conditions = this.conditionsData.find(c => c.currency === this.selectedCurrency)!;
      this.minAmount = conditions.min_amount;
      this.maxAmount = conditions.max_amount;
      this.minTerm = conditions.min_month;
      this.maxTerm = conditions.max_month;
      this.minRate = conditions.min_percentage;
      this.maxRate = conditions.max_percentage;
      
    } else {
      // РЕЖИМ ПО УМОЛЧАНИЮ
      this.availableCurrencies = ['tjs', 'usd'];
      const conditions = this.loanService.getConditions(this.selectedCurrency as 'TJS' | 'USD');
      this.minAmount = conditions.minAmount;
      this.maxAmount = conditions.maxAmount;
      this.minTerm = conditions.minTerm;
      this.maxTerm = conditions.maxTerm;
      this.minRate = conditions.minRate;
      this.maxRate = conditions.maxRate;
    
    }

    this.loanAmount = this.minAmount;
    this.loanTerm = this.minTerm;
    this.interestRatePercent = this.minRate;
    this.amountLabels = [`${this.minAmount}`, `${this.maxAmount}`];
    this.termLabels = [`${this.minTerm} мес.`, `${this.maxTerm} мес.`];
    this.rateLabels = [`${this.minRate}%`, `${this.maxRate}%`];
    this.recalculate();
  }

  onCurrencyChange(currency: Currency): void {
    this.selectedCurrency = currency;
    this.setupOrUpdate();
  }

  recalculate(): void {
    let numericAmount = parseInt(String(this.loanAmount).replace(/\D/g, ''));
    if (isNaN(numericAmount)) { numericAmount = this.minAmount; }
    
    if (!this.isEditingAmount) {
      if (numericAmount > this.maxAmount) { numericAmount = this.maxAmount; }
      if (numericAmount < this.minAmount) { numericAmount = this.minAmount; }
    }
    this.loanAmount = numericAmount;

    this.loanTerm = Math.max(this.minTerm, Math.min(this.loanTerm, this.maxTerm));
    this.interestRatePercent = Math.max(this.minRate, Math.min(this.interestRatePercent, this.maxRate));

    this.calculationResult = this.loanService.calculate({
      amount: this.loanAmount,
      term: this.loanTerm,
      annualRate: this.interestRatePercent / 100,
    });
    
    this.updateVisuals();
  }
  
  startEditing(): void {
    this.isEditingAmount = true;
  }

  stopEditing(): void {
    this.isEditingAmount = false;
    this.recalculate();
  }
  
  updateVisuals(): void {
    this.loanAmountPercent = (this.maxAmount > this.minAmount) ? `${((this.loanAmount - this.minAmount) / (this.maxAmount - this.minAmount)) * 100}%` : '0%';
    this.loanTermPercent = (this.maxTerm > this.minTerm) ? `${((this.loanTerm - this.minTerm) / (this.maxTerm - this.minTerm)) * 100}%` : '0%';
    this.ratePercent = (this.maxRate > this.minRate) ? `${((this.interestRatePercent - this.minRate) / (this.maxRate - this.minRate)) * 100}%` : '0%';
  }
}
