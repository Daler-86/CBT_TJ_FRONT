import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchExchangeRates();
  }

  get ratesCount(): number {
    return this.exchangeRatesByMode[this.selectedMode]?.length || 0;
  }
  fetchExchangeRates() {
    this.http.get('http://192.168.42.200:8025/ws/v3/info/exchange-rates', { responseType: 'text' })
      .subscribe({
        next: (data: string) => {
          this.parseXML(data); // Парсим XML, если запрос успешен
        },
        error: (err) => {
          console.error('Error fetching exchange rates:', err); // Обработка ошибок
        }
      });
  }

  parseXML(data: string) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'application/xml');
    const rates = xml.getElementsByTagName('rate');
    this.exchangeRatesByMode = {}; // Очистка предыдущих данных

    Array.from(rates).forEach(rate => {
      const mode = rate.getElementsByTagName('mode')[0].textContent || ''; // Режим обмена
      const currency = rate.getElementsByTagName('cur')[0].textContent || ''; // Валюта
      const buy = parseFloat(rate.getElementsByTagName('buy')[0].textContent || '0'); // Покупка
      const sell = parseFloat(rate.getElementsByTagName('sell')[0].textContent || '0'); // Продажа
      const flag = this.getFlag(currency); // Получение иконки флага для валюты

      if (!this.exchangeRatesByMode[mode]) {
        this.exchangeRatesByMode[mode] = [];
      }

      this.exchangeRatesByMode[mode].push({ currency, buy, sell, flag });
    });

    this.lastUpdated = xml.getElementsByTagName('lastUpdate')[0]?.textContent || ''; // Получение даты последнего обновления

    const modes = this.getModes();
    if (modes.length > 0) {
      this.selectedMode = modes[0]; // Установка режима по умолчанию
      this.updateCurrencies(); // Обновляем валюты после выбора режима
    }
  }

  getFlag(currency: string): string {
    switch (currency) {
      case 'USD': return '../../assets/icons/usd.svg';
      case 'EUR': return '../../assets/icons/euro.svg';
      case 'RUB': return '../../assets/icons/rub.svg';
      case 'KZT': return '../../../assets/icons/kzt.png';
      case 'TJS': return '../../assets/icons/tjs.svg';
      default: return '../../assets/icons/default.svg';
    }
  }

  getModes(): string[] {
    return ['REMITTANCE_RATE', 'CASH', 'CB_RATE'];
  }

  getReadableMode(mode: string): string {
    switch (mode) {
      case 'CASH': return 'В кассе';
      case 'REMITTANCE_RATE': return 'Денежные переводы';
      case 'CB_RATE': return 'НБТ';
      default: return mode;
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