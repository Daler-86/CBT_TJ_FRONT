
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RateService } from '../../api/rate.service';
import { ProcessedRate } from '../../models/rate.model';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface Mode {
  key: string;
  label: string;
}

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [TranslateModule, FormsModule, HttpClientModule],
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

  
  modes$!: Observable<Mode[]>;

  private translate = inject(TranslateService);
  private rateService = inject(RateService);

  ngOnInit() {
    this.initModesStream();
    this.fetchExchangeRates();
  }

  get ratesCount(): number {
    return this.exchangeRatesByMode[this.selectedMode]?.length || 0;
  }

  private initModesStream() {
    const cash$ = this.translate.stream('CURRENCY_CONVERTER.RATE_MODES.CASH');
    const nonCash$ = this.translate.stream('CURRENCY_CONVERTER.RATE_MODES.NON_CASH');
    const cbRate$ = this.translate.stream('CURRENCY_CONVERTER.RATE_MODES.CB_RATE');

    this.modes$ = combineLatest([nonCash$, cash$, cbRate$]).pipe(
      map(([nonCash, cash, cbRate]) => [
        { key: 'REMITTANCE_RATE', label: nonCash },
        { key: 'CASH', label: cash },
        { key: 'CB_RATE', label: cbRate },
      ])
    );
  }

  fetchExchangeRates() {
    this.rateService.getProcessedExchangeRates().subscribe({
      next: (processedData) => {
        this.exchangeRatesByMode = processedData.ratesByMode;
        this.lastUpdated = processedData.lastUpdated;

        if (!this.selectedMode && Object.keys(this.exchangeRatesByMode).length > 0) {
          this.selectedMode = Object.keys(this.exchangeRatesByMode)[0];
          this.updateCurrencies();
        }
      },
      error: (err) => console.error('Error fetching exchange rates:', err),
    });
  }

  selectMode(mode: string) {
    this.selectedMode = mode;
    this.updateCurrencies();
  }

  toggleTransaction() {
    this.transactionType = this.transactionType === 'buy' ? 'sell' : 'buy';
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


    if (!this.amount || this.fromCurrency === this.toCurrency) {
      this.convertedAmount = this.amount;
      return;
    }


    if (this.transactionType === 'buy') {
      if (this.fromCurrency === 'TJS') {
        const toRate = rates?.find((rate) => rate.currency === this.toCurrency);
        this.convertedAmount = toRate ? this.amount / toRate.sell : 0;
      } else if (this.toCurrency === 'TJS') {
        const fromRate = rates?.find((rate) => rate.currency === this.fromCurrency);
        this.convertedAmount = fromRate ? this.amount * fromRate.sell : 0;
      }
    } else if (this.transactionType === 'sell') {
      if (this.fromCurrency === 'TJS') {
        const toRate = rates?.find((rate) => rate.currency === this.toCurrency);
        this.convertedAmount = toRate ? this.amount / toRate.buy : 0;
      } else if (this.toCurrency === 'TJS') {
        const fromRate = rates?.find((rate) => rate.currency === this.fromCurrency);
        this.convertedAmount = fromRate ? this.amount * fromRate.buy : 0;
      }
    }
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  sendMoney() {
    alert(`Вы отправили ${this.convertedAmount.toFixed(2)} ${this.toCurrency}`);
  }
}

