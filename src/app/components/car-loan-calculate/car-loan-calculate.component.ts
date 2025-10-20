import { Component, OnInit, inject } from '@angular/core';
import { AutoLoanResult } from '../../models/calculate.model';
import { CarLoanService } from '../../services/car-loan.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
type Currency = 'tjs' | 'usd';

@Component({
  selector: 'app-car-loan-calculate',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterLink, TranslateModule],
  templateUrl: './car-loan-calculate.component.html',
  styleUrl: './car-loan-calculate.component.scss',
})
export class CarLoanCalculateComponent implements OnInit {
  // Состояние формы
  carCost = 0;
  downPayment = 0;
  loanTerm = 24;
  interestRate = 0;
  selectedCurrency: Currency = 'tjs';

  // UI-настройки (всегда берутся из сервиса)
  minCarCost = 0;
  maxCarCost = 0;
  minDownPayment = 0;
  maxDownPayment = 0;
  minTerm = 0;
  maxTerm = 0;
  minRate = 0;
  maxRate = 0;
  readonly availableTerms = [12, 18, 24, 30, 36];

  // Визуальные свойства
  carCostPercent = '0%';
  downPaymentPercent = '0%';
  financingAmount = 0;

  // Результаты
  calculationResult: AutoLoanResult | null = null;

  // Флаги для редактирования
  isEditingCarCost = false;
  isEditingDownPayment = false;
  costLabels: string[] = [];
  downPaymentLabels: string[] = [];
  public autoLoanService = inject(CarLoanService);

  ngOnInit(): void {
    this.setupCalculator();
  }

  selectCurrency(currency: Currency): void {
    this.selectedCurrency = currency;
    this.setupCalculator();
  }
  private formatShortNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)} млн`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)} тыс.`;
    }
    return String(Math.round(num));
  }
  setupCalculator(): void {
    const conditions = this.autoLoanService.getConditions(this.selectedCurrency);

    this.minCarCost = conditions.minCarCost;
    this.maxCarCost = conditions.maxCarCost;
    this.minTerm = conditions.minTerm;
    this.maxTerm = conditions.maxTerm;
    this.minRate = conditions.minRate;
    this.maxRate = conditions.maxRate;

    // Устанавливаем начальные значения
    this.carCost = this.minCarCost;
    this.loanTerm = this.availableTerms[2] || this.minTerm;
    this.interestRate = this.minRate;
    this.costLabels = [this.formatShortNumber(this.minCarCost), this.formatShortNumber(this.maxCarCost)];
    // this.termLabels = [`${this.minTerm} мес.`, `${this.maxTerm} мес.`];
    this.recalculate();
  }

  recalculate(): void {
    // Валидация
    this.carCost = Math.max(this.minCarCost, Math.min(this.carCost, this.maxCarCost));
    const minDownPayment =
      this.carCost * this.autoLoanService.getConditions(this.selectedCurrency).minDownPaymentPercent;
    this.downPayment = Math.max(minDownPayment, Math.min(this.downPayment, this.carCost));
    this.interestRate = Math.max(this.minRate, Math.min(this.interestRate, this.maxRate));
    const minDown = this.carCost * this.autoLoanService.getConditions(this.selectedCurrency).minDownPaymentPercent;
    const maxDown = this.carCost;
    this.downPaymentLabels = [this.formatShortNumber(minDown), this.formatShortNumber(maxDown)];

    // Расчет
    this.calculationResult = this.autoLoanService.calculate({
      carCost: this.carCost,
      downPayment: this.downPayment,
      term: this.loanTerm,
      annualRate: this.interestRate / 100,
    });
    this.calculationResult.totalOverpayment = Number(this.calculationResult.totalOverpayment);

    this.updateVisuals();
  }

  updateVisuals(): void {
    if (!this.calculationResult) return;

    this.financingAmount = this.calculationResult.financingAmount;

    this.carCostPercent =
      this.maxCarCost > this.minCarCost
        ? `${((this.carCost - this.minCarCost) / (this.maxCarCost - this.minCarCost)) * 100}%`
        : '0%';
    const minDownPayment =
      this.carCost * this.autoLoanService.getConditions(this.selectedCurrency).minDownPaymentPercent;
    this.downPaymentPercent =
      this.carCost > minDownPayment
        ? `${((this.downPayment - minDownPayment) / (this.carCost - minDownPayment)) * 100}%`
        : '0%';
  }

  // Методы для "умных" инпутов
  startEditing(field: 'carCost' | 'downPayment') {
    if (field === 'carCost') this.isEditingCarCost = true;
    if (field === 'downPayment') this.isEditingDownPayment = true;
  }

  stopEditing() {
    this.isEditingCarCost = false;
    this.isEditingDownPayment = false;
    this.recalculate();
  }
}
