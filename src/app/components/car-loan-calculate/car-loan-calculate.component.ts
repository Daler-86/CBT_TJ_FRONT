import { Component, OnInit, inject } from '@angular/core';
import { CarLoanResult } from '../../models/calculate.model';
import { CarLoanService } from '../../services/car-loan.service';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-loan-calculate',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, PercentPipe],
  templateUrl: './car-loan-calculate.component.html',
  styleUrl: './car-loan-calculate.component.scss'
})
export class CarLoanCalculateComponent implements OnInit{
  private carLoanService = inject(CarLoanService);

  // --- Состояние формы ---
  carCost: number = 188000;
  downPayment: number = 25000;
  loanTerm: number = 24;
  selectedCurrency: 'TJS' | 'USD' = 'TJS';

  // --- Динамические UI-настройки ---
  minCarCost=0; maxCarCost=0; stepCarCost=1; costLabels: string[]=[];
  minDownPayment=0; maxDownPayment=0; stepDownPayment=1; downPaymentLabels: string[]=[]; // Добавили подписи
  minTerm=0; maxTerm=0; stepTerm=1; termLabels: string[]=[];
  
  // --- Визуальные свойства ---
  carCostPercent=''; downPaymentPercent=''; loanTermPercent='';
  formattedCarCost=''; formattedDownPayment=''; formattedLoanTerm='';
  currencySymbol = 'c.'; // Символ валюты

  // --- Результат расчета ---
  calculationResult: CarLoanResult | null = null;

  ngOnInit(): void {
    this.onSettingsChange();
  }
  
  onSettingsChange(): void {
    const conditions = this.carLoanService.getConditions(this.selectedCurrency);
    this.currencySymbol = this.selectedCurrency === 'TJS' ? 'c.' : '$';

    // Настройка стоимости авто
    this.minCarCost = conditions.minCarCost;
    this.maxCarCost = conditions.maxCarCost;
    this.stepCarCost = conditions.stepCarCost;
    this.costLabels = conditions.costLabels;

    // Настройка срока
    this.minTerm = conditions.minTerm;
    this.maxTerm = conditions.maxTerm;
    this.stepTerm = conditions.stepTerm;
    this.termLabels = conditions.termLabels;

    // Корректируем текущие значения, если они вышли за новые рамки
    this.carCost = Math.max(this.minCarCost, Math.min(this.carCost, this.maxCarCost));
    this.loanTerm = Math.max(this.minTerm, Math.min(this.loanTerm, this.maxTerm));

    // Обновляем лимиты для предоплаты и пересчитываем все
    this.updateDownPaymentAndRecalculate();
  }
  
  /**
   * Обновляет лимиты предоплаты и запускает полный пересчет.
   * Вызывается при изменении стоимости авто или валюты.
   */
  updateDownPaymentAndRecalculate(): void {
    const conditions = this.carLoanService.getConditions(this.selectedCurrency);
    
    // Минимальная предоплата - 20% от стоимости авто
    this.minDownPayment = Math.round(this.carCost * conditions.minDownPaymentPercent);
    // Максимальная предоплата - 90% от стоимости авто (чтобы сумма кредита не была нулевой)
    this.maxDownPayment = Math.round(this.carCost * 0.9); 
    this.stepDownPayment = this.stepCarCost;

    // Логика, чтобы текущее значение предоплаты не "вылетало" за новые рамки
    this.downPayment = Math.max(this.minDownPayment, Math.min(this.downPayment, this.maxDownPayment));

    // Обновляем подписи для слайдера предоплаты
    const midDownPayment = Math.round((this.minDownPayment + this.maxDownPayment) / 2);
    this.downPaymentLabels = [
      `${new Intl.NumberFormat('ru-RU').format(this.minDownPayment)}`,
      `${new Intl.NumberFormat('ru-RU').format(midDownPayment)}`,
      `${new Intl.NumberFormat('ru-RU').format(this.maxDownPayment)}`
    ];
    
    this.recalculate();
  }

  recalculate(): void {
    this.calculationResult = this.carLoanService.calculate({
      carCost: this.carCost,
      downPayment: this.downPayment,
      term: this.loanTerm,
      currency: this.selectedCurrency
    });
    this.updateVisuals();
  }

  updateVisuals(): void {
    // 1. Форматирование с символом валюты
    this.formattedCarCost = `${new Intl.NumberFormat('ru-RU').format(this.carCost)} ${this.currencySymbol}`;
    this.formattedDownPayment = `${new Intl.NumberFormat('ru-RU').format(this.downPayment)} ${this.currencySymbol}`;
    this.formattedLoanTerm = `${this.loanTerm} мес`;

    // 2. Расчет процентов для заливки слайдеров
    this.carCostPercent = `${((this.carCost - this.minCarCost) / (this.maxCarCost - this.minCarCost)) * 100}%`;
    this.downPaymentPercent = `${((this.downPayment - this.minDownPayment) / (this.maxDownPayment - this.minDownPayment)) * 100}%`;
    this.loanTermPercent = `${((this.loanTerm - this.minTerm) / (this.maxTerm - this.minTerm)) * 100}%`;
  }

  applyForLoan(): void {
    console.log('Заявка на автокредит:', {
      currency: this.selectedCurrency,
      carCost: this.carCost,
      downPayment: this.downPayment,
      term: this.loanTerm,
      ...this.calculationResult
    });
    alert('Ваша заявка на автокредит отправлена!');
  }
}
