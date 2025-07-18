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
export class InstallmentCalculateComponent {
 
  private installmentService = inject(InstallmentService);

  // --- Условия ---
  minAmount = 0;
  maxAmount = 0;
  availableTerms: number[] = [];

  // --- Состояние формы ---
  loanAmount: number = 10000;
  loanTerm: number = 12; // Срок по умолчанию

  // --- Визуальные свойства ---
  formattedLoanAmount = '';
  loanAmountPercent = '0%';
  amountLabels: string[] = [];

  // --- Результат расчета ---
  calculationResult: InstallmentResult | null = null;
  
  constructor() {}

  ngOnInit(): void {
    const conditions = this.installmentService.getConditions();
    this.minAmount = conditions.minAmount;
    this.maxAmount = conditions.maxAmount;
    this.availableTerms = this.installmentService.getAvailableTerms();
    this.amountLabels = [`${this.minAmount/1000} тыс.`, `${this.maxAmount/2000} тыс.`, `${this.maxAmount/1000} тыс.`];

    // Устанавливаем срок по умолчанию, если его нет в списке
    if (!this.availableTerms.includes(this.loanTerm)) {
      this.loanTerm = this.availableTerms[3] || this.availableTerms[0];
    }
    
    this.recalculate();
  }

  onValueChange(): void {
    this.recalculate();
  }
  
  recalculate(): void {
    if (!this.loanAmount || !this.loanTerm) {
      this.calculationResult = null;
      return;
    }
    
    this.calculationResult = this.installmentService.calculate({
      amount: this.loanAmount,
      term: this.loanTerm,
    });
    
    this.updateVisuals();
  }
  
  updateVisuals(): void {
    this.formattedLoanAmount = new Intl.NumberFormat('ru-RU').format(this.loanAmount);
    this.loanAmountPercent = `${((this.loanAmount - this.minAmount) / (this.maxAmount - this.minAmount)) * 100}%`;
  }
  
  applyForInstallment(): void {
    // console.log('Заявка на рассрочку:', {
    //   amount: this.loanAmount,
    //   term: this.loanTerm,
    //   ...this.calculationResult,
    // });
    alert('Ваша заявка на рассрочку отправлена!');
  }
}
