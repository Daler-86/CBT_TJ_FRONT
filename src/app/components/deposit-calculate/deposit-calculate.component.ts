import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


import { CalculationResult, DepositProducts } from '../../models/deposit.model';
import { DepositsService } from '../../api/deposit.service';
import { DepositCalculateService } from '../../services/deposit-calculate.service';

@Component({
  selector: 'app-deposit-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Важно для работы с формами
  
    PercentPipe,
    FormsModule
    // NgModel        // Пайп для форматирования процентов
  ],
  templateUrl: './deposit-calculate.component.html',
  styleUrls: ['./deposit-calculate.component.scss']
})
export class DepositCalculatorComponent implements OnInit {
  @Input() productId?: string | number;

  depositAmount: number = 0;
  depositTerm: number = 0;
  selectedCurrency: 'TJS' | 'USD' = 'TJS';
  selectedProductId: string = '1'; // ID продукта по умолчанию

  minAmount = 0; maxAmount = 0; stepAmount = 100;
  minTerm = 0; maxTerm = 0; stepTerm = 1;
  
  amountLabels: string[] = [];
  termLabels: string[] = [];
  
  depositAmountPercent = '0%';
  depositTermPercent = '0%';
  
  productsData: DepositProducts;
  productKeys: string[];
  calculationResult: CalculationResult | null = null;
  isProductAvailable: boolean = true;
  availableCurrencies: ('TJS' | 'USD')[] = [];
  
  // Флаг для "умного" инпута
  isEditingAmount: boolean = false;
  
  constructor(private depositService: DepositCalculateService) {
    this.productsData = this.depositService.getProductsData();
    this.productKeys = Object.keys(this.productsData);
  }

  ngOnInit(): void {
    if (this.productId === undefined) {
      this.setupCalculator();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId']) {
      this.setupCalculator();
    }
  }

  setupCalculator(): void {
    const externalId = this.productId ? String(this.productId) : undefined;
    this.selectedProductId = (externalId && this.productsData[externalId]) ? externalId : this.productKeys[0];
    
    // Обновляем список доступных валют для выбранного продукта
    const product = this.productsData[this.selectedProductId];
    if(product) {
      this.availableCurrencies = Object.keys(product.currencies).filter(c => product.currencies[c as 'TJS' | 'USD'] !== null) as ('TJS'|'USD')[];
      // Если текущая валюта недоступна, переключаемся на первую доступную
      if (!this.availableCurrencies.includes(this.selectedCurrency)) {
        this.selectedCurrency = this.availableCurrencies[0];
      }
    }
    
    this.onSettingsChange();
  }
  
  onSettingsChange(): void {
    this.updateUIForSelectedProduct();
    this.recalculate();
  }

  selectCurrency(currency: 'TJS' | 'USD'): void {
    this.selectedCurrency = currency;
    this.onSettingsChange();
  }

  updateUIForSelectedProduct(): void {
    const conditions = this.depositService.getProductConditions(this.selectedProductId, this.selectedCurrency);
    if (conditions) {
      this.isProductAvailable = true;
      this.minAmount = conditions.minAmount;
      this.maxAmount = conditions.maxAmount;
      this.stepAmount = conditions.stepAmount;
      this.amountLabels = conditions.amountLabels;
      this.minTerm = conditions.minTerm;
      this.maxTerm = conditions.maxTerm;
      this.stepTerm = conditions.stepTerm;
      // this.termLabels = conditions.termLabels;
      const midTerm = Math.round((this.minTerm + this.maxTerm) / 2);
      this.termLabels = [
        `${this.minTerm} мес.`,
        `${midTerm} мес.`,
        `${this.maxTerm} мес.`
      ];
      this.depositAmount = Math.max(this.minAmount, Math.min(this.depositAmount, this.maxAmount));
      this.depositTerm = Math.max(this.minTerm, Math.min(this.depositTerm, this.maxTerm));
    } else {
      this.isProductAvailable = false;
    }
  }
  
  recalculate(): void {
    let numericAmount = parseInt(String(this.depositAmount).replace(/\D/g, ''));
    if (isNaN(numericAmount)) numericAmount = this.minAmount;

    if (!this.isEditingAmount) {
      if (numericAmount > this.maxAmount) numericAmount = this.maxAmount;
      if (numericAmount < this.minAmount) numericAmount = this.minAmount;
    }
    this.depositAmount = numericAmount;

    this.calculationResult = this.depositService.calculateDeposit({
      productId: this.selectedProductId,
      amount: this.depositAmount,
      termMonths: this.depositTerm,
      currency: this.selectedCurrency
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
    this.depositAmountPercent = (this.maxAmount > this.minAmount) ? `${((this.depositAmount - this.minAmount) / (this.maxAmount - this.minAmount)) * 100}%` : '0%';
    this.depositTermPercent = (this.maxTerm > this.minTerm) ? `${((this.depositTerm - this.minTerm) / (this.maxTerm - this.minTerm)) * 100}%` : '0%';
  }
}