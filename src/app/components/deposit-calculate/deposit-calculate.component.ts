import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';


import { CalculationResult, DepositProducts } from '../../models/deposit.model';

import { DepositCalculateService } from '../../services/deposit-calculate.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-deposit-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Важно для работы с формами
    RouterLink,
    PercentPipe,
    FormsModule
    // NgModel        // Пайп для форматирования процентов
  ],
  templateUrl: './deposit-calculate.component.html',
  styleUrls: ['./deposit-calculate.component.scss']
})
export class DepositCalculatorComponent implements OnInit {
  @Input() productId?: string | number;
  @Input() showApplyButton: boolean = false;
  depositAmount: number = 0;
  depositTerm: number = 0;
  selectedCurrency: 'TJS' | 'USD' = 'TJS';
  selectedProductId: string = '1';

  minAmount = 0; maxAmount = 0; stepAmount = 100;
  minTerm = 0; maxTerm = 0; stepTerm = 1;
  
  amountLabels: string[] = [];
  termLabels: string[] = [];
  
  depositAmountPercent = '0%';
  depositTermPercent = '0%';
  
  public productName: string = ''; // Для отображения названия выбранного продукта
  public dropdownOpen: boolean = false;

  productsData: DepositProducts;
  productKeys: string[];
  calculationResult: CalculationResult | null = null;
  isProductAvailable: boolean = true;
  availableCurrencies: ('TJS' | 'USD')[] = [];
  
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
  
    // --- ИЗМЕНЕННАЯ ЛОГИКА ---
    // Устанавливаем ID продукта, только если он пришел извне (@Input)
    // или если это самая первая загрузка (selectedProductId еще не установлен).
    if (externalId && this.productsData[externalId]) {
      this.selectedProductId = externalId;
    } else if (!this.selectedProductId) { // Если еще никакой продукт не выбран
      this.selectedProductId = this.productKeys[0];
    }
    // Теперь this.selectedProductId содержит правильное значение,
    // будь то выбор пользователя или начальная установка.
    // --- КОНЕЦ ИЗМЕНЕНИЙ ---
  
    // Остальной код метода остается без изменений, так как теперь он будет работать с правильным ID
    this.productName = this.productsData[this.selectedProductId]?.name || 'Выберите продукт';
    const product = this.productsData[this.selectedProductId];
    if(product) {
      this.availableCurrencies = Object.keys(product.currencies).filter(c => product.currencies[c as 'TJS' | 'USD'] !== null) as ('TJS'|'USD')[];
      if (!this.availableCurrencies.includes(this.selectedCurrency)) {
        this.selectedCurrency = this.availableCurrencies[0];
      }
    }
    
    this.updateUIForSelectedProduct();
    this.recalculate();
  }
  
  // Этот метод больше не нужен, его логика перенесена
  // onSettingsChange(): void { ... }

  selectCurrency(currency: 'TJS' | 'USD'): void {
    this.selectedCurrency = currency;
    this.updateUIForSelectedProduct();
    this.recalculate(); // <-- Вызываем recalculate после смены валюты
  }
  selectProduct(productId: string): void {
    this.selectedProductId = productId;
    this.productName = this.productsData[productId].name; // Обновляем имя для отображения
    this.dropdownOpen = false; // Закрываем список
    this.setupCalculator(); // Перенастраиваем калькулятор для нового продукта
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
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
      const midTerm = Math.round((this.minTerm + this.maxTerm) / 2);
      this.termLabels = [ `${this.minTerm} мес.`, `${midTerm} мес.`, `${this.maxTerm} мес.` ];
      // Устанавливаем начальные значения, если они выходят за рамки
      if(this.depositAmount < this.minAmount || this.depositAmount > this.maxAmount) {
        this.depositAmount = this.minAmount;
      }
      if(this.depositTerm < this.minTerm || this.depositTerm > this.maxTerm) {
        this.depositTerm = this.minTerm;
      }
    } else {
      this.isProductAvailable = false;
    }
  }
  
  recalculate(): void {
    // 1. Берем текущее значение и ПРЕВРАЩАЕМ В СТРОКУ для очистки
    let valueAsString = String(this.depositAmount);
    
    // 2. Очищаем от всего, кроме цифр
    let cleanedString = valueAsString.replace(/\D/g, '');

    // 3. Превращаем обратно в число
    let numericAmount = parseInt(cleanedString, 10);

    // 4. Валидируем
    if (isNaN(numericAmount)) { numericAmount = this.minAmount; }
    if (numericAmount > this.maxAmount) { numericAmount = this.maxAmount; }
    if (numericAmount < this.minAmount) { numericAmount = this.minAmount; }
    
    // 5. === КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ ===
    // Присваиваем в this.depositAmount именно ЧИСЛО.
    // Слайдер теперь всегда будет получать number и не будет "ломаться".
    this.depositAmount = numericAmount;

    // 6. Расчет
    this.calculationResult = this.depositService.calculateDeposit({
      productId: this.selectedProductId,
      amount: this.depositAmount, // Передаем чистое число
      termMonths: this.depositTerm,
      currency: this.selectedCurrency
    });

    // 7. Обновление визуальных частей
    this.updateVisuals();
  }

  startEditing(): void {
    this.isEditingAmount = true;
  }


  stopEditing(): void {
    this.isEditingAmount = false;
  
    this.depositAmount = Number(this.depositAmount); // 👈 форсируем число

    this.recalculate();
  }

  updateVisuals(): void {
    this.depositAmountPercent = (this.maxAmount > this.minAmount) ? `${((this.depositAmount - this.minAmount) / (this.maxAmount - this.minAmount)) * 100}%` : '0%';
    this.depositTermPercent = (this.maxTerm > this.minTerm) ? `${((this.depositTerm - this.minTerm) / (this.maxTerm - this.minTerm)) * 100}%` : '0%';
  }
}