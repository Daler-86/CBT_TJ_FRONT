import { Component, OnInit, inject, OnChanges, Input, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { LoanCalculationResult, LoanConditionsData } from '../../models/calculate.model';
import { LoanService } from '../../services/loan.service';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollToDirective } from '../../directives/scroll-to.directive';
import { TranslateModule } from '@ngx-translate/core';

type Currency = 'tjs' | 'usd';

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, PercentPipe, ScrollToDirective, TranslateModule],
  templateUrl: './loan-calculator.component.html',
  styleUrl: './loan-calculator.component.scss',
})
export class LoanCalculatorComponent implements OnChanges, OnInit {
  @Input() conditionsData?: LoanConditionsData[];
  @Input() showApplyButton = false;

  @ViewChild('amountInput') amountInput?: ElementRef<HTMLInputElement>;

  loanAmount = 0;
  loanTerm = 0;
  interestRatePercent = 0;

  selectedCurrency: Currency = 'tjs';
  availableCurrencies: Currency[] = [];

  minAmount = 0;
  maxAmount = 0;
  minTerm = 0;
  maxTerm = 0;
  minRate = 0;
  maxRate = 0;

  loanAmountPercent = '0%';
  loanTermPercent = '0%';
  ratePercent = '0%';

  calculationResult: any = null;
  isEditingAmount = false;
  isAmountInvalid = false;

  private loanService = inject(LoanService);

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
      this.availableCurrencies = this.conditionsData.map((c) => c.currency.toLowerCase() as Currency);

      if (!this.availableCurrencies.includes(this.selectedCurrency)) {
        this.selectedCurrency = this.availableCurrencies[0];
      }

      const conditions = this.conditionsData.find((c) => c.currency.toLowerCase() === this.selectedCurrency)!;

      this.minAmount = conditions.min_amount;
      this.maxAmount = conditions.max_amount;
      this.minTerm = conditions.min_month;
      this.maxTerm = conditions.max_month;
      this.minRate = conditions.min_percentage;
      this.maxRate = conditions.max_percentage;

      this.loanAmount = this.minAmount;
      this.loanTerm = this.minTerm;
      this.interestRatePercent = this.minRate;
    } else {
      this.availableCurrencies = ['tjs', 'usd'];
    }

    this.recalculate();
  }

  onCurrencyChange(currency: Currency): void {
    if (this.selectedCurrency === currency) return;
    this.selectedCurrency = currency;
    this.setupOrUpdate();
  }
  handleFocus(event: Event): void {
    const target = event.target as HTMLInputElement;
    target.select();
  }

  recalculate(event?: Event): void {
    if (event && event.target) {
      const target = event.target as HTMLInputElement;
      let rawValue = target.value;

      if (rawValue === '' || rawValue === null) {
        this.loanAmount = 0;
        target.value = '0';
      } else {
        const numValue = Math.abs(Number(rawValue));
        this.loanAmount = numValue;
        target.value = numValue.toString();
      }
    } else {
      this.loanAmount = Math.abs(Number(this.loanAmount || 0));
    }
    this.isAmountInvalid = this.loanAmount < this.minAmount || this.loanAmount > this.maxAmount;
    this.interestRatePercent = Math.round(this.interestRatePercent);

    const P = this.loanAmount || 0;
    const n = Math.max(1, this.loanTerm);
    const annualRate = this.interestRatePercent || 0;
    const i = annualRate / 100 / 12;

    let monthlyPayment = 0;
    let totalOverpayment = 0;

    if (P > 0 && n > 0) {
      if (i > 0) {
        const pow = Math.pow(1 + i, n);
        monthlyPayment = (P * (i * pow)) / (pow - 1);
        monthlyPayment = Math.round(monthlyPayment * 100) / 100;
        totalOverpayment = monthlyPayment * n - P;
      } else {
        monthlyPayment = P / n;
        totalOverpayment = 0;
      }
    }

    this.calculationResult = {
      monthlyPayment: monthlyPayment,
      totalOverpayment: totalOverpayment,
      interestRate: annualRate / 100,
    };

    this.updateVisuals();
  }

  startEditing(): void {
    this.isEditingAmount = true;
    setTimeout(() => this.amountInput?.nativeElement.focus(), 0);
  }

  stopEditing(): void {
    this.isEditingAmount = false;
    this.recalculate();
  }

  updateVisuals(): void {
    const calcPct = (v: number, min: number, max: number) => {
      if (max <= min) return '0%';
      const p = ((v - min) / (max - min)) * 100;
      return `${Math.max(0, Math.min(100, p))}%`;
    };

    this.loanAmountPercent = calcPct(this.loanAmount, this.minAmount, this.maxAmount);
    this.loanTermPercent = calcPct(this.loanTerm, this.minTerm, this.maxTerm);
    this.ratePercent = calcPct(this.interestRatePercent, this.minRate, this.maxRate);
  }
}
