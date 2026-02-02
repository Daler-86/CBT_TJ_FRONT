import { HttpClientModule } from '@angular/common/http';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RateService } from '../../api/rate.service';
import { ProcessedRate } from '../../models/rate.model';
import {DatePipe, DecimalPipe, NgClass, SlicePipe } from '@angular/common';

interface Mode {
  key: string;
  label: string;
}

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [TranslateModule, FormsModule, HttpClientModule, DecimalPipe, NgClass, DatePipe, SlicePipe],
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  transactionType: 'buy' | 'sell' = 'buy';
  fromCurrency = 'TJS';
  toCurrency = 'USD';
  amount = 0;
  convertedAmount = 0;
  lastUpdated = '';
  selectedMode = '';
  exchangeRatesByMode: Record<string, ProcessedRate[]> = {};
  showMore = false;
  showFromDropdown = false;
  showToDropdown = false;
  modes: Mode[] = [];

  private rateService = inject(RateService);

  ngOnInit() {
    this.modes = [
      { key: 'REMITTANCE_RATE', label: 'CURRENCY_CONVERTER.RATE_MODES.NON_CASH' },
      { key: 'CASH', label: 'CURRENCY_CONVERTER.RATE_MODES.CASH' },
      { key: 'CB_RATE', label: 'CURRENCY_CONVERTER.RATE_MODES.CB_RATE' },
    ];

    // 2. Устанавливаем selectedMode, если ещё пустой
    if (!this.selectedMode && this.modes.length > 0) {
      this.selectedMode = this.modes[0].key;
      this.updateCurrencies();
    }

    // 3. Загружаем курсы валют
    this.fetchExchangeRates();
  }

  get ratesCount(): number {
    return this.exchangeRatesByMode[this.selectedMode]?.length || 0;
  }
  selectFromCurrency(currency: string) {
    this.fromCurrency = currency;
    this.showFromDropdown = false;
    this.updateCurrencies();
  }

  selectToCurrency(currency: string) {
    this.toCurrency = currency;
    this.showToDropdown = false;
    this.convertCurrency();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.currency-select-container')) {
      this.showFromDropdown = false;
      this.showToDropdown = false;
    }
  }
  fetchExchangeRates() {
    this.rateService.getProcessedExchangeRates().subscribe({
      next: (processedData) => {
        this.exchangeRatesByMode = processedData.ratesByMode;
        this.lastUpdated = processedData.lastUpdated;
        this.updateCurrencies();
      },
      error: (err) => console.error('Error fetching exchange rates:', err),
    });
  }

  selectMode(mode: string) {
    this.selectedMode = mode;
    this.updateCurrencies();
  }

  toggleTransaction(type: 'buy' | 'sell') {
    this.transactionType = type;
    this.convertCurrency();
  }

  updateCurrencies() {
    if (this.fromCurrency === 'TJS') {
      this.toCurrency =
        this.toCurrency !== 'TJS'
          ? this.toCurrency
          : this.exchangeRatesByMode[this.selectedMode]?.[0]?.currency || 'USD';
    } else {
      this.toCurrency = 'TJS';
    }
    this.convertCurrency();
  }
  convertCurrency() {
    const rates = this.exchangeRatesByMode[this.selectedMode];

    if (!this.amount || !rates || this.fromCurrency === this.toCurrency) {
      this.convertedAmount = this.amount || 0;
      return;
    }

    const foreignCurrency = this.fromCurrency === 'TJS' ? this.toCurrency : this.fromCurrency;
    const rateEntry = rates.find((r) => r.currency === foreignCurrency);

    if (!rateEntry) return;

    let activeRate = 0;

    if (this.selectedMode === 'CB_RATE') {
      activeRate = rateEntry.buy;
    } else {
      if (this.transactionType === 'buy') {
        activeRate = this.fromCurrency === 'TJS' ? rateEntry.buy : rateEntry.sell;
      } else {
        activeRate = this.fromCurrency === 'TJS' ? rateEntry.sell : rateEntry.buy;
      }
    }

    if (activeRate > 0) {
      if (this.fromCurrency === 'TJS') {
        this.convertedAmount = this.amount / activeRate;
      } else {
        this.convertedAmount = this.amount * activeRate;
      }
    }
  }
  onAmountInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    let val = target.value;

    if (val === '') {
      this.amount = 0;
      target.value = '';
    } else {
      const numValue = Math.abs(parseInt(val, 10));

      this.amount = numValue;
      target.value = numValue.toString();
    }

    this.convertCurrency();
  }

  handleFocus(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.select) {
      target.select();
    }
  }
  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  sendMoney() {
    alert(`Вы отправили ${this.convertedAmount.toFixed(2)} ${this.toCurrency}`);
  }
}
