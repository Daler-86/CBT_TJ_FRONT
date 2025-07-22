import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstallmentResult } from '../../models/calculate.model';
import { InstallmentService } from '../../services/installment.service';

// Модель для результатов расчета
interface InstallmentCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  interestRate: number;
}
@Component({
  selector: 'app-installment-calculate',
  standalone: true,
  imports: [CommonModule, FormsModule,  PercentPipe],
  templateUrl: './installment-calculate.component.html',
  styleUrl: './installment-calculate.component.scss'
})
export class InstallmentCalculateComponent implements OnInit { // <-- Возвращаем OnInit
 
  private installmentService = inject(InstallmentService);

  // --- Условия ---
  minAmount = 0;
  maxAmount = 0;
  availableTerms: number[] = [];

  // --- Состояние формы ---
  loanAmount: number = 10000;
  loanTerm: number = 12;

  // --- Визуальные свойства ---
  loanAmountPercent = '0%';
  amountLabels: string[] = [];

  // === НОВЫЙ ФЛАГ ДЛЯ УМНОГО ИНПУТА ===
  isEditingAmount: boolean = false;

  // --- Результат расчета ---
  calculationResult: InstallmentResult | null = null;
  
  constructor() {}

  ngOnInit(): void {
    const conditions = this.installmentService.getConditions();
    this.minAmount = conditions.minAmount;
    this.maxAmount = conditions.maxAmount;
    this.availableTerms = this.installmentService.getAvailableTerms();
    this.amountLabels = [`${this.minAmount/1000} тыс.`, `${this.maxAmount/2} тыс.`, `${this.maxAmount/1000} тыс.`];

    if (!this.availableTerms.includes(this.loanTerm)) {
      this.loanTerm = this.availableTerms[0];
    }
    
    this.recalculate();
  }

  onValueChange(): void {
    this.recalculate();
  }
  
  recalculate(): void {
    // Валидация
    if (!this.isEditingAmount) { // Валидируем, только если пользователь не вводит вручную
        this.loanAmount = Math.max(this.minAmount, Math.min(this.loanAmount, this.maxAmount));
    }

    this.calculationResult = this.installmentService.calculate({
      amount: this.loanAmount,
      term: this.loanTerm,
    });
    
    this.updateVisuals();
  }
  
  updateVisuals(): void {
    this.loanAmountPercent = (this.maxAmount > this.minAmount) ? `${((this.loanAmount - this.minAmount) / (this.maxAmount - this.minAmount)) * 100}%` : '0%';
  }
  
  applyForInstallment(): void {
    alert('Ваша заявка на рассрочку отправлена!');
  }

  // === НОВЫЕ МЕТОДЫ ДЛЯ УМНОГО ИНПУТА ===
  startEditing(): void {
    this.isEditingAmount = true;
  }

  stopEditing(): void {
    this.isEditingAmount = false;
    this.recalculate(); // Финальная валидация при выходе из поля
  }
}