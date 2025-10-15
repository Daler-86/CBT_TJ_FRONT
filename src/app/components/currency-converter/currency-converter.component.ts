import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { RateService } from '../../api/rate.service';

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
  imports: [TranslateModule, FormsModule, NgFor, CommonModule, HttpClientModule,NgIf],
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit {
  transactionType: 'buy' | 'sell' = 'buy';
  fromCurrency: string = 'TJS';
  toCurrency: string = 'USD';
  amount: number = 0;
  convertedAmount: number = 0;
  lastUpdated: string = '';
  selectedMode: string='';
  exchangeRatesByMode: { [key: string]: any[] } = {};
  showMore: boolean = false;

  constructor(private http: HttpClient, private translate: TranslateService, private rateService:RateService) {}

  ngOnInit() {
    this.fetchExchangeRates();
  }

  get ratesCount(): number {
    return this.exchangeRatesByMode[this.selectedMode]?.length || 0;
  }
  fetchExchangeRates() {
    this.rateService.getProcessedExchangeRates().subscribe({
      next: (processedData) => {
        // Просто присваиваем готовые данные свойствам компонента
        this.exchangeRatesByMode = processedData.ratesByMode;
        this.lastUpdated = processedData.lastUpdated;

        // Устанавливаем режим по умолчанию после получения данных
        const modes = this.getModes();
        if (modes.length > 0) {
          this.selectedMode = modes[0]; 
          this.updateCurrencies(); 
        }
      },
      error: (err) => {
     
        console.error('Error fetching and processing exchange rates:', err);
      }
    });
  }



  getModes(): string[] {
    return ['REMITTANCE_RATE', 'CASH', 'CB_RATE'];
  }


  getReadableMode(mode: string): string {
    // Используем translate.instant() для синхронного получения перевода
    switch (mode) {
      case 'CASH':
        return this.translate.instant('CURRENCY_CONVERTER.RATE_MODES.CASH');
      case 'REMITTANCE_RATE':
        return this.translate.instant('CURRENCY_CONVERTER.RATE_MODES.NON_CASH');
      case 'CB_RATE':
        return this.translate.instant('CURRENCY_CONVERTER.RATE_MODES.CB_RATE');
      default:
        return mode; // На случай, если появится новый режим
    }
  }

  selectMode(mode:string) {
    this.selectedMode = mode;
    this.updateCurrencies();
  }

 

  toggleTransaction() {
    this.transactionType = this.transactionType === 'buy' ? 'sell' : 'buy';
  
    this.convertCurrency();
  }
  updateCurrencies() {
    if (this.fromCurrency === 'TJS') {
      // У нас есть сомони, можем получить любую валюту
      this.toCurrency = this.toCurrency !== 'TJS' ? this.toCurrency : (this.exchangeRatesByMode[this.selectedMode]?.[0]?.currency || 'USD');
    } else {
      // У нас есть иностранная валюта, можем получить только сомони
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
      // Покупка: используем курс из второго столбца (продажа)
      if (this.fromCurrency === 'TJS') {
        // У нас есть сомони, покупаем иностранную валюту
        const toRate = rates?.find(rate => rate.currency === this.toCurrency);
        if (toRate) {
          this.convertedAmount = this.amount / toRate.sell; // Используем курс продажи для получения иностранной валюты
        } else {
          this.convertedAmount = 0;
        }
      } else if (this.toCurrency === 'TJS') {
        // У нас есть иностранная валюта, покупаем сомони
        const fromRate = rates?.find(rate => rate.currency === this.fromCurrency);
        if (fromRate) {
          this.convertedAmount = this.amount * fromRate.sell; // Используем курс продажи для получения сомони
        } else {
          this.convertedAmount = 0;
        }
      }
    } else if (this.transactionType === 'sell') {
      // Продажа: используем курс из третьего столбца (покупка)
      if (this.fromCurrency === 'TJS') {
        // У нас есть сомони, продаем за иностранную валюту
        const toRate = rates?.find(rate => rate.currency === this.toCurrency);
        if (toRate) {
          this.convertedAmount = this.amount / toRate.buy; // Используем курс покупки для получения иностранной валюты
        } else {
          this.convertedAmount = 0;
        }
      } else if (this.toCurrency === 'TJS') {
        // У нас есть иностранная валюта, продаем её за сомони
        const fromRate = rates?.find(rate => rate.currency === this.fromCurrency);
        if (fromRate) {
          this.convertedAmount = this.amount * fromRate.buy; // Используем курс покупки для получения сомони
        } else {
          this.convertedAmount = 0;
        }
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