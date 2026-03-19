import { Component, Input, OnInit, SimpleChanges, inject, OnChanges } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalculationResult, DepositProducts } from '../../models/deposit.model';
import { DepositCalculateService } from '../../services/deposit-calculate.service';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Languages } from '../../shared/enums/languages.enum';

@Component({
  selector: 'app-deposit-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PercentPipe, FormsModule, TranslateModule],
  templateUrl: './deposit-calculate.component.html',
  styleUrls: ['./deposit-calculate.component.scss'],
})
export class DepositCalculatorComponent implements OnInit, OnChanges {
  @Input() productId?: string | number;
  @Input() showApplyButton = false;
  depositAmount = 0;
  depositTerm = 0;
  selectedCurrency: 'TJS' | 'USD' = 'TJS';
  selectedProductId: string = Languages.Tj;

  minAmount = 0;
  maxAmount = 0;
  stepAmount = 100;
  minTerm = 0;
  maxTerm = 0;
  stepTerm = 1;

  amountLabels: string[] = [];
  termLabels: string[] = [];

  depositAmountPercent = '0%';
  depositTermPercent = '0%';

  public productName = '';
  public dropdownOpen = false;

  productsData: DepositProducts;
  productKeys: string[];
  calculationResult: CalculationResult | null = null;
  isProductAvailable = true;
  availableCurrencies: ('TJS' | 'USD')[] = [];

  isEditingAmount = false;
  private depositService = inject(DepositCalculateService);

  constructor(private router: Router) {
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

    if (externalId && this.productsData[externalId]) {
      this.selectedProductId = externalId;
    } else if (!this.selectedProductId) {
      this.selectedProductId = this.productKeys[0];
    }

    this.productName = this.productsData[this.selectedProductId]?.name || 'Выберите продукт';
    const product = this.productsData[this.selectedProductId];
    if (product) {
      this.availableCurrencies = Object.keys(product.currencies).filter(
        (c) => product.currencies[c as 'TJS' | 'USD'] !== null,
      ) as ('TJS' | 'USD')[];
      if (!this.availableCurrencies.includes(this.selectedCurrency)) {
        this.selectedCurrency = this.availableCurrencies[0];
      }
    }

    this.updateUIForSelectedProduct();
    this.recalculate();
  }

  selectCurrency(currency: 'TJS' | 'USD'): void {
    this.selectedCurrency = currency;
    this.updateUIForSelectedProduct();
    this.recalculate();
  }

  selectProduct(productId: string): void {
    this.selectedProductId = productId;
    this.productName = this.productsData[productId].name;
    this.dropdownOpen = false;
    this.setupCalculator();
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
      this.termLabels = [`${this.minTerm} мес.`, `${midTerm} мес.`, `${this.maxTerm} мес.`];

      if (this.depositAmount < this.minAmount || this.depositAmount > this.maxAmount) {
        this.depositAmount = this.minAmount;
      }
      if (this.depositTerm < this.minTerm || this.depositTerm > this.maxTerm) {
        this.depositTerm = this.minTerm;
      }
    } else {
      this.isProductAvailable = false;
    }
  }

  recalculate(): void {
    const valueAsString = String(this.depositAmount);
    const cleanedString = valueAsString.replace(/\D/g, '');
    let numericAmount = parseInt(cleanedString, 10);

    if (isNaN(numericAmount)) {
      numericAmount = this.minAmount;
    }
    if (numericAmount > this.maxAmount) {
      numericAmount = this.maxAmount;
    }
    if (numericAmount < this.minAmount) {
      numericAmount = this.minAmount;
    }

    this.depositAmount = numericAmount;

    this.calculationResult = this.depositService.calculateDeposit({
      productId: this.selectedProductId,
      amount: this.depositAmount,
      termMonths: this.depositTerm,
      currency: this.selectedCurrency,
    });

    this.updateVisuals();
  }

  startEditing(): void {
    this.isEditingAmount = true;
  }

  stopEditing(): void {
    this.isEditingAmount = false;

    this.depositAmount = Number(this.depositAmount);

    this.recalculate();
  }
  onApply() {
    const targetUrl = `/deposits/${this.selectedProductId}`;
  
    if (this.router.url.includes(targetUrl)) {
      const element = document.getElementById('application-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate([targetUrl], { 
        queryParams: { scrollTo: 'application-form' } 
      });
    }
  }
  updateVisuals(): void {
    this.depositAmountPercent =
      this.maxAmount > this.minAmount
        ? `${((this.depositAmount - this.minAmount) / (this.maxAmount - this.minAmount)) * 100}%`
        : '0%';
    this.depositTermPercent =
      this.maxTerm > this.minTerm
        ? `${((this.depositTerm - this.minTerm) / (this.maxTerm - this.minTerm)) * 100}%`
        : '0%';
  }
}
