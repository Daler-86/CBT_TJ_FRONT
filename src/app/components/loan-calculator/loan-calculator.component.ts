import { Component, OnInit, inject } from '@angular/core';
import { LoanCalculationResult } from '../../models/calculate.model';
import { LoanService } from '../../services/loan.service';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports:  [CommonModule, FormsModule, CurrencyPipe, PercentPipe],
  templateUrl: './loan-calculator.component.html',
  styleUrl: './loan-calculator.component.scss'
})
export class LoanCalculatorComponent implements OnInit{

  private loanService = inject(LoanService);

  // --- Состояние формы ---
  loanAmount = 10000;
  loanTerm = 12;
  selectedProductId = 'barakat';
  selectedCurrency: 'TJS' | 'USD' = 'TJS';
  selectedClientType = 'Новый клиент';
  
  // --- UI-настройки ---
  minAmount = 0; maxAmount = 0; stepAmount = 100;
  minTerm = 0; maxTerm = 0; stepTerm = 1;
  amountLabels: string[] = []; termLabels: string[] = [];
  loanAmountPercent = '0%';
  loanTermPercent = '0%'; 
  // --- Данные для выбора ---
  products: any;
  productKeys: string[] = [];
  availableCurrencies: ('TJS' | 'USD')[] = [];
  availableClientTypes: string[] = [];
  
  // --- Результат расчета ---
  calculationResult: LoanCalculationResult | null = null;
  
  constructor() {
    this.products = this.loanService.getProducts();
    this.productKeys = Object.keys(this.products);
  }

  ngOnInit(): void {
    this.onProductChange();
  }
  
  onProductChange(): void {
    const product = this.products[this.selectedProductId];
    this.availableCurrencies = Object.keys(product.currencies) as ('TJS' | 'USD')[];
    
    if (!this.availableCurrencies.includes(this.selectedCurrency)) {
      this.selectedCurrency = this.availableCurrencies[0];
    }
    
    this.availableClientTypes = product.clientTypes || [];
    if (this.availableClientTypes.length > 0 && !this.availableClientTypes.includes(this.selectedClientType)) {
      this.selectedClientType = this.availableClientTypes[0];
    }
    
    this.onSettingsChange();
  }

  onSettingsChange(): void {
    const conditions = this.loanService.getConditions(this.selectedProductId, this.selectedCurrency, this.selectedClientType);
    if(conditions) {
      this.minAmount = conditions.minAmount;
      this.maxAmount = conditions.maxAmount;
      this.minTerm = conditions.minTerm;
      this.maxTerm = conditions.maxTerm;

      this.amountLabels = [`${this.minAmount/1000} тыс.`, `${this.maxAmount/1000} тыс.`];
      this.termLabels = [`${this.minTerm} мес.`, `${this.maxTerm} мес.`];

      this.loanAmount = Math.max(this.minAmount, Math.min(this.loanAmount, this.maxAmount));
      this.loanTerm = Math.max(this.minTerm, Math.min(this.loanTerm, this.maxTerm));
    }
    this.recalculate();
  }

  recalculate(): void {
    this.calculationResult = this.loanService.calculate({
      productId: this.selectedProductId,
      currency: this.selectedCurrency,
      clientType: this.selectedClientType,
      amount: this.loanAmount,
      term: this.loanTerm,
    });
    this.loanAmountPercent = `${((this.loanAmount - this.minAmount) / (this.maxAmount - this.minAmount)) * 100}%`;
this.loanTermPercent = `${((this.loanTerm - this.minTerm) / (this.maxTerm - this.minTerm)) * 100}%`;
  }
}
