import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { AutoLoanConditions, AutoLoanResult, CarLoanResult } from '../../models/calculate.model';
import { CarLoanService } from '../../services/car-loan.service';
import { CommonModule, CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
type Currency = 'tjs' | 'usd';

@Component({
  selector: 'app-car-loan-calculate',
  standalone: true,
  imports: [CommonModule, FormsModule,  DecimalPipe  ],
  templateUrl: './car-loan-calculate.component.html',
  styleUrl: './car-loan-calculate.component.scss'
})
// export class CarLoanCalculateComponent implements OnInit{
//   private carLoanService = inject(CarLoanService);

//   // --- Состояние формы ---
//   carCost: number = 188000;
//   downPayment: number = 25000;
//   loanTerm: number = 24;
//   selectedCurrency: 'TJS' | 'USD' = 'TJS';

//   interestRate: number = 20;
//   readonly minRate: number = 20;
//   readonly maxRate: number = 25;
//   // --- Динамические UI-настройки ---
//   minCarCost=0; maxCarCost=0; stepCarCost=1; costLabels: string[]=[];
//   minDownPayment=0; maxDownPayment=0; stepDownPayment=1; downPaymentLabels: string[]=[]; // Добавили подписи
//   minTerm=0; maxTerm=0; stepTerm=1; termLabels: string[]=[];
//   ratePercent = '20%';
//   // --- Визуальные свойства ---
//   carCostPercent=''; downPaymentPercent=''; loanTermPercent='';
//   formattedCarCost=''; formattedDownPayment=''; formattedLoanTerm='';
//   currencySymbol = 'c.'; // Символ валюты

//   // --- Результат расчета ---
//   calculationResult: CarLoanResult | null = null;

//   ngOnInit(): void {
//     this.onSettingsChange();
//   }
  
//   onSettingsChange(): void {
//     const conditions = this.carLoanService.getConditions(this.selectedCurrency);
//     this.currencySymbol = this.selectedCurrency === 'TJS' ? 'c.' : '$';

//     // Настройка стоимости авто
//     this.minCarCost = conditions.minCarCost;
//     this.maxCarCost = conditions.maxCarCost;
//     this.stepCarCost = conditions.stepCarCost;
//     this.costLabels = conditions.costLabels;

//     // Настройка срока
//     this.minTerm = conditions.minTerm;
//     this.maxTerm = conditions.maxTerm;
//     this.stepTerm = conditions.stepTerm;
//     this.termLabels = conditions.termLabels;

//     // Корректируем текущие значения, если они вышли за новые рамки
//     this.carCost = Math.max(this.minCarCost, Math.min(this.carCost, this.maxCarCost));
//     this.loanTerm = Math.max(this.minTerm, Math.min(this.loanTerm, this.maxTerm));

//     // Обновляем лимиты для предоплаты и пересчитываем все
//     this.updateDownPaymentAndRecalculate();
//   }
  
//   /**
//    * Обновляет лимиты предоплаты и запускает полный пересчет.
//    * Вызывается при изменении стоимости авто или валюты.
//    */
//   updateDownPaymentAndRecalculate(): void {
//     const conditions = this.carLoanService.getConditions(this.selectedCurrency);
    
//     // Минимальная предоплата - 20% от стоимости авто
//     this.minDownPayment = Math.round(this.carCost * conditions.minDownPaymentPercent);
//     // Максимальная предоплата - 90% от стоимости авто (чтобы сумма кредита не была нулевой)
//     this.maxDownPayment = Math.round(this.carCost * 0.9); 
//     this.stepDownPayment = this.stepCarCost;

//     // Логика, чтобы текущее значение предоплаты не "вылетало" за новые рамки
//     this.downPayment = Math.max(this.minDownPayment, Math.min(this.downPayment, this.maxDownPayment));

//     // Обновляем подписи для слайдера предоплаты
//     const midDownPayment = Math.round((this.minDownPayment + this.maxDownPayment) / 2);
//     this.downPaymentLabels = [
//       `${new Intl.NumberFormat('ru-RU').format(this.minDownPayment)}`,
//       `${new Intl.NumberFormat('ru-RU').format(midDownPayment)}`,
//       `${new Intl.NumberFormat('ru-RU').format(this.maxDownPayment)}`
//     ];
    
//     this.recalculate();
//   }

//   recalculate(): void {
//     this.calculationResult = this.carLoanService.calculate({
//       carCost: this.carCost,
//       downPayment: this.downPayment,
//       term: this.loanTerm,
//       currency: this.selectedCurrency,
//       annualRate: this.interestRate / 100 
//     });
//     this.updateVisuals();
//   }

//   updateVisuals(): void {
//     // 1. Форматирование с символом валюты
//     this.formattedCarCost = `${new Intl.NumberFormat('ru-RU').format(this.carCost)} ${this.currencySymbol}`;
//     this.formattedDownPayment = `${new Intl.NumberFormat('ru-RU').format(this.downPayment)} ${this.currencySymbol}`;
//     this.formattedLoanTerm = `${this.loanTerm} мес`;

//     // 2. Расчет процентов для заливки слайдеров
//     this.carCostPercent = `${((this.carCost - this.minCarCost) / (this.maxCarCost - this.minCarCost)) * 100}%`;
//     this.downPaymentPercent = `${((this.downPayment - this.minDownPayment) / (this.maxDownPayment - this.minDownPayment)) * 100}%`;
//     this.loanTermPercent = `${((this.loanTerm - this.minTerm) / (this.maxTerm - this.minTerm)) * 100}%`;
//     this.ratePercent = `${((this.interestRate - this.minRate) / (this.maxRate - this.minRate)) * 100}%`;
//   }

//   applyForLoan(): void {
//     console.log('Заявка на автокредит:', {
//       currency: this.selectedCurrency,
//       carCost: this.carCost,
//       downPayment: this.downPayment,
//       term: this.loanTerm,
//       ...this.calculationResult
//     });
//     alert('Ваша заявка на автокредит отправлена!');
//   }
// }

export class CarLoanCalculateComponent  {
   
  // Состояние формы
  carCost: number = 0;
  downPayment: number = 0;
  loanTerm: number = 24;
  interestRate: number = 0;
  selectedCurrency: Currency = 'tjs';

  // UI-настройки (всегда берутся из сервиса)
  minCarCost=0; maxCarCost=0;
  minDownPayment=0; maxDownPayment=0;
  minTerm=0; maxTerm=0;
  minRate=0; maxRate=0;
  readonly availableTerms = [12, 18, 24, 30, 36];

  // Визуальные свойства
  carCostPercent = '0%';
  downPaymentPercent = '0%';
  financingAmount: number = 0;

  // Результаты
  calculationResult: AutoLoanResult | null = null;
  
  // Флаги для редактирования
  isEditingCarCost = false;
  isEditingDownPayment = false;
  costLabels: string[] = [];
  downPaymentLabels: string[] = [];

  constructor(public autoLoanService: CarLoanService) {}

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
    this.costLabels = [
      this.formatShortNumber(this.minCarCost), 
      this.formatShortNumber(this.maxCarCost)
    ];
    // this.termLabels = [`${this.minTerm} мес.`, `${this.maxTerm} мес.`];
    this.recalculate();
  }
  
  recalculate(): void {
    // Валидация
    this.carCost = Math.max(this.minCarCost, Math.min(this.carCost, this.maxCarCost));
    const minDownPayment = this.carCost * this.autoLoanService.getConditions(this.selectedCurrency).minDownPaymentPercent;
    this.downPayment = Math.max(minDownPayment, Math.min(this.downPayment, this.carCost));
    this.interestRate = Math.max(this.minRate, Math.min(this.interestRate, this.maxRate));
    const minDown = this.carCost * this.autoLoanService.getConditions(this.selectedCurrency).minDownPaymentPercent;
    const maxDown = this.carCost;
    this.downPaymentLabels = [
      this.formatShortNumber(minDown), 
      this.formatShortNumber(maxDown)
    ];
    
    // Расчет
    this.calculationResult = this.autoLoanService.calculate({
      carCost: this.carCost,
      downPayment: this.downPayment,
      term: this.loanTerm,
      annualRate: this.interestRate / 100
    });
    this.calculationResult.totalOverpayment = Number(this.calculationResult.totalOverpayment);
  
    this.updateVisuals();
  }
  
  updateVisuals(): void {
    if(!this.calculationResult) return;
    
    this.financingAmount = this.calculationResult.financingAmount;
    
    this.carCostPercent = (this.maxCarCost > this.minCarCost) ? `${((this.carCost - this.minCarCost) / (this.maxCarCost - this.minCarCost)) * 100}%` : '0%';
    const minDownPayment = this.carCost * this.autoLoanService.getConditions(this.selectedCurrency).minDownPaymentPercent;
    this.downPaymentPercent = (this.carCost > minDownPayment) ? `${((this.downPayment - minDownPayment) / (this.carCost - minDownPayment)) * 100}%` : '0%';
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