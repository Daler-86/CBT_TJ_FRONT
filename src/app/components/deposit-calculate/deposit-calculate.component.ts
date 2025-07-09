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
    CurrencyPipe,      // Пайп для форматирования валюты
    PercentPipe,
    FormsModule
    // NgModel        // Пайп для форматирования процентов
  ],
  templateUrl: './deposit-calculate.component.html',
  styleUrls: ['./deposit-calculate.component.scss']
})
export class DepositCalculatorComponent implements OnInit {
    // @Input() будет принимать ID извне. Если он не передан, калькулятор покажет выпадающий список.
    @Input() productId?: string | number;

    // Свойство для управления выбором в выпадающем списке
    // selectedProductId: string = '';

  depositAmount: number = 20000;
  depositTerm: number = 12;
  selectedCurrency: 'TJS' | 'USD' = 'TJS';
  selectedProductId: string = 'favri';

  minAmount: number = 0; maxAmount: number = 0; stepAmount: number = 1; amountLabels: string[] = [];
  minTerm: number = 0; maxTerm: number = 0; stepTerm: number = 1; termLabels: string[] = [];
  
  formattedDepositAmount: string = '';
  formattedDepositTerm: string = '';
  depositAmountPercent: string = '0%';
  depositTermPercent: string = '0%';
  
  productsData: DepositProducts;
  productKeys: string[];
  calculationResult: CalculationResult | null = null;
  isProductAvailable: boolean = true;
  readonly availableCurrencies: ('TJS' | 'USD')[] = ['TJS', 'USD'];
  constructor(private depositService: DepositCalculateService) {
    this.productsData = this.depositService.getProductsData();
    this.productKeys = Object.keys(this.productsData);
  }

  ngOnInit(): void {
    // this.onSettingsChange();
    this.setupCalculator();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Если родительский компонент изменил productId, перезапускаем калькулятор
    if (changes['productId']) {
      this.setupCalculator();
    }
  }
  onSettingsChange(): void {
    this.updateUIForSelectedProduct();
    this.recalculate();
  }

  setupCalculator(): void {
    // Если productId передан через @Input, используем его.
    // Иначе, используем первый продукт из списка как значение по умолчанию для выпадающего списка.
    const externalId = this.productId ? String(this.productId) : undefined;
    this.selectedProductId = (externalId && this.productsData[externalId]) ? externalId : this.productKeys[0];
    this.onSettingsChange();
  }
  onSliderChange(): void {
    this.recalculate();
  }

  onDepositAmountChange(value: string): void {
    const numericValue = parseInt(value.replace(/\s/g, ''), 10);
    if (!isNaN(numericValue)) {
      this.depositAmount = numericValue;
      this.recalculate();
    }
  }
  selectCurrency(currency: 'TJS' | 'USD'): void {
    this.selectedCurrency = currency;
    this.onSettingsChange();
  }
  updateUIForSelectedProduct(): void {
    // Всегда используем this.selectedProductId для получения условий
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
      this.termLabels = conditions.termLabels;

      this.depositAmount = Math.max(this.minAmount, Math.min(this.depositAmount, this.maxAmount));
      this.depositTerm = Math.max(this.minTerm, Math.min(this.depositTerm, this.maxTerm));
    } else {
      this.isProductAvailable = false;
    }
  }
  
  recalculate(): void {
    this.calculationResult = this.depositService.calculateDeposit({
      productId: this.selectedProductId,
      amount: this.depositAmount,
      termMonths: this.depositTerm,
      currency: this.selectedCurrency
    });
    this.updateVisuals();
  }


 

  updateVisuals(): void {
    this.formattedDepositAmount = new Intl.NumberFormat('ru-RU').format(this.depositAmount);
    this.formattedDepositTerm = `${this.depositTerm} мес.`;
    this.depositAmountPercent = `${((this.depositAmount - this.minAmount) / (this.maxAmount - this.minAmount)) * 100}%`;
    this.depositTermPercent = `${((this.depositTerm - this.minTerm) / (this.maxTerm - this.minTerm)) * 100}%`;
  }

  applyForDeposit(): void {
    console.log('Заявка на вклад:', this.calculationResult);
    alert('Ваша заявка отправлена!');
  }
}