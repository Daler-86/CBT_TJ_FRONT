import { CommonModule, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

interface ExchangeRate {
  currency: string;
  buy: number;
  sell: number;
  flag: string;
}

interface ExchangeRatesByMode {
  [key: string]: ExchangeRate[];
}

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [TranslateModule, FormsModule, NgFor, CommonModule, HttpClientModule],
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'] // исправлено styleUrl на styleUrls
})
export class CurrencyConverterComponent {
  amount: number = 0;
  fromCurrency: string = '';
  toCurrency: string = '';
  convertedAmount: number = 0;
  lastUpdated: string = '';
  selectedMode: string = '';
  exchangeRatesByMode: ExchangeRatesByMode = {};

  constructor(private http: HttpClient) {
    this.fetchExchangeRates();
  }

  // Function to handle mode selection via button click
  selectMode(mode: string) {
    this.selectedMode = mode;
    this.updateCurrencies();
  }

  fetchExchangeRates() {
    this.http.get('http://192.168.42.200:8025/ws/v3/info/exchange-rates', { responseType: 'text' })
      .subscribe((data: string) => {
        this.parseXML(data);
      });
  }

  parseXML(data: string) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'application/xml');
    const rates = xml.getElementsByTagName('rate');
    this.exchangeRatesByMode = {};

    Array.from(rates).forEach(rate => {
      const mode = rate.getElementsByTagName('mode')[0].textContent || '';
      const currency = rate.getElementsByTagName('cur')[0].textContent || '';
      const buy = parseFloat(rate.getElementsByTagName('buy')[0].textContent || '0');
      const sell = parseFloat(rate.getElementsByTagName('sell')[0].textContent || '0');
      const flag = this.getFlag(currency);

      if (!this.exchangeRatesByMode[mode]) {
        this.exchangeRatesByMode[mode] = [];
      }

      this.exchangeRatesByMode[mode].push({ currency, buy, sell, flag });
    });

    this.lastUpdated = xml.getElementsByTagName('lastUpdate')[0]?.textContent || '';

    const modes = this.getModes();
    if (modes.length > 0) {
      this.selectedMode = modes[0]; // Set the default selected mode
      this.updateCurrencies(); // Update currencies for the default mode
    }
  }

  getFlag(currency: string): string {
    switch (currency) {
      case 'USD': return '../../assets/icons/usd.svg';
      case 'EUR': return '../../assets/icons/euro.svg';
      case 'RUB': return '../../assets/icons/rub.svg';
      case 'KZT': return '../../assets/icons/kzt.png';
      default: return '';
    }
  }

  getModes(): string[] {
    return Object.keys(this.exchangeRatesByMode);
  }

  updateCurrencies() {
    if (this.selectedMode) {
      const rates = this.exchangeRatesByMode[this.selectedMode];
      if (rates.length > 0) {
        this.fromCurrency = rates[0].currency;
        this.toCurrency = rates[0].currency !== this.fromCurrency ? rates[0].currency : (rates[1] ? rates[1].currency : rates[0].currency);
        this.convertCurrency();
      }
    }
  }

  convertCurrency() {
    const fromRate = this.exchangeRatesByMode[this.selectedMode]?.find(rate => rate.currency === this.fromCurrency);
    const toRate = this.exchangeRatesByMode[this.selectedMode]?.find(rate => rate.currency === this.toCurrency);

    if (fromRate && toRate) {
      this.convertedAmount = (this.amount * fromRate.sell) / toRate.buy;
    } else {
      this.convertedAmount = 0; // Reset if no rate is found
    }
  }

  sendMoney() {
    alert(`You sent ${this.convertedAmount.toFixed(2)} ${this.toCurrency}`);
  }
}

