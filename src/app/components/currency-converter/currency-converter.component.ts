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


// export class CurrencyConverterComponent implements OnInit {
//   amount: number = 0;
//   fromCurrency: string = 'TJS'; // Сомони по умолчанию
//   toCurrency: string = 'USD'; // Валюта для конвертации по умолчанию
//   convertedAmount: number = 0;
//   lastUpdated: string = '';
//   selectedMode: string = ''; // Выбранный режим обмена
//   exchangeRatesByMode: ExchangeRatesByMode = {}; // Хранение курсов по режимам
//   showMore: boolean = false;
  
//   transactionType: string = 'buy';

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.fetchExchangeRates(); // Загружаем курсы при инициализации компонента
//   }
//   get ratesCount(): number {
//     return this.exchangeRatesByMode[this.selectedMode]?.length || 0;
//   }
//   // Получение курсов обмена с сервера
//   fetchExchangeRates() {
//     this.http.get('http://192.168.42.200:8025/ws/v3/info/exchange-rates', { responseType: 'text' })
//       .subscribe({
//         next: (data: string) => {
//           this.parseXML(data); // Парсим XML, если запрос успешен
//         },
//         error: (err) => {
//           console.error('Error fetching exchange rates:', err); // Обработка ошибок
//         }
//       });
//   }

//   // Парсинг XML данных
//   parseXML(data: string) {
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(data, 'application/xml');
//     const rates = xml.getElementsByTagName('rate');
//     this.exchangeRatesByMode = {}; // Очистка предыдущих данных

//     Array.from(rates).forEach(rate => {
//       const mode = rate.getElementsByTagName('mode')[0].textContent || ''; // Режим обмена
//       const currency = rate.getElementsByTagName('cur')[0].textContent || ''; // Валюта
//       const buy = parseFloat(rate.getElementsByTagName('buy')[0].textContent || '0'); // Покупка
//       const sell = parseFloat(rate.getElementsByTagName('sell')[0].textContent || '0'); // Продажа
//       const flag = this.getFlag(currency); // Получение иконки флага для валюты

//       if (!this.exchangeRatesByMode[mode]) {
//         this.exchangeRatesByMode[mode] = [];
//       }

//       this.exchangeRatesByMode[mode].push({ currency, buy, sell, flag });
//     });

//     this.lastUpdated = xml.getElementsByTagName('lastUpdate')[0]?.textContent || ''; // Получение даты последнего обновления

//     const modes = this.getModes();
//     if (modes.length > 0) {
//       this.selectedMode = modes[0]; // Установка режима по умолчанию
//       this.updateCurrencies(); // Обновляем валюты после выбора режима
//     }
//   }

//   // Логика получения пути к флагу по коду валюты
//   getFlag(currency: string): string {
//     switch (currency) {
//       case 'USD': return '../../assets/icons/usd.svg';
//       case 'EUR': return '../../assets/icons/euro.svg';
//       case 'RUB': return '../../assets/icons/rub.svg';
//       case 'KZT': return '../../../assets/icons/kzt.png';
//       case 'TJS': return '../../assets/icons/tjs.svg';
//       default: return '../../assets/icons/default.svg'; // Значение по умолчанию
//     }
//   }

//   // Функция для преобразования режимов в удобочитаемые строки
//   getReadableMode(mode: string): string {
//     switch (mode) {
//       case 'CASH': return 'В кассе';
//       case 'REMITTANCE_RATE': return 'Денежные переводы';
//       case 'CB_RATE': return 'НБТ';
//       default: return mode;
//     }
//   }

//   // Функция для получения списка режимов
//   getModes(): string[] {
//     return ['REMITTANCE_RATE', 'CASH', 'CB_RATE']; // Возвращаем только нужные режимы
//   }

//   // Функция для выбора режима
//   selectMode(mode: string) {
//     this.selectedMode = mode;
//     this.updateCurrencies(); // Обновляем валюты после выбора режима
//   }

//   // Обновляем валюты после выбора режима
//   updateCurrencies() {
//     if (this.selectedMode) {
//       const rates = this.exchangeRatesByMode[this.selectedMode]; // Получаем курсы для выбранного режима
//       if (rates.length > 0) {
//         // Убедимся, что при переключении режима валюты корректно выбираются
//         if (this.transactionType === 'buy') {
//           this.fromCurrency = 'TJS';
//           this.toCurrency = rates.find(rate => rate.currency !== 'TJS')?.currency || rates[0].currency;
//         } else {
//           this.fromCurrency = rates.find(rate => rate.currency !== 'TJS')?.currency || rates[0].currency;
//           this.toCurrency = 'TJS';
//         }
//         this.convertCurrency(); // Выполняем конвертацию
//       }
//     }
//   }

//   // Функция для конвертации валют
//   setTransactionType(type: string) {
//     this.transactionType = type;
//     this.updateCurrencySelection(); // Обновляем выбор валют после изменения типа транзакции
//     this.convertCurrency();
//   }

//   // Метод для переключения состояния при каждом клике
//   toggleTransaction(): void {
//     this.transactionType = this.transactionType === 'buy' ? 'sell' : 'buy';
//     this.updateCurrencySelection(); // Обновляем выбор валют после переключения типа транзакции
//     this.convertCurrency();

//     // Запуск анимации
//     const anim = document.querySelector('animate');
//     if (anim) {
//       (anim as any).beginElement(); // Запуск анимации
//     }
//   }

//   // Обновление выбора валют для поддержания корректного обмена
//   updateCurrencySelection() {
//     if (this.transactionType === 'buy') {
//       // Если покупаем, выбираем любую валюту для покупки, но платим Сомони
//       this.fromCurrency = 'TJS';
//       const rates = this.exchangeRatesByMode[this.selectedMode];
//       this.toCurrency = rates.find(rate => rate.currency !== 'TJS')?.currency || '';
//     } else {
//       // Если продаем, выбираем любую валюту для продажи и получаем Сомони
//       const rates = this.exchangeRatesByMode[this.selectedMode];
//       this.fromCurrency = rates.find(rate => rate.currency !== 'TJS')?.currency || '';
//       this.toCurrency = 'TJS';
//     }
//   }

//   // Функция для конвертации валют
//   convertCurrency() {
//     if (this.transactionType === 'buy') {
//       // Покупаем валюту за сомони
//       const toRate = this.exchangeRatesByMode[this.selectedMode]?.find(rate => rate.currency === this.toCurrency);
//       if (toRate) {
//         this.convertedAmount = this.amount / toRate.sell;
//       } else {
//         this.convertedAmount = 0; // Если курсы не найдены
//       }
//     } else {
//       // Продаем валюту и получаем сомони
//       const fromRate = this.exchangeRatesByMode[this.selectedMode]?.find(rate => rate.currency === this.fromCurrency);
//       if (fromRate) {
//         this.convertedAmount = this.amount * fromRate.buy;
//       } else {
//         this.convertedAmount = 0; // Если курсы не найдены
//       }
//     }
//   }

//   toggleShowMore() {
//     this.showMore = !this.showMore;
//   }

//   // Отправка денег (эмуляция)
//   sendMoney() {
//     alert(`Вы отправили ${this.convertedAmount.toFixed(2)} ${this.toCurrency}`);
//   }
// }
export class CurrencyConverterComponent implements OnInit {
  amount: number = 0;
  fromCurrency: string = 'TJS'; // Сомони по умолчанию
  toCurrency: string = 'USD'; // Валюта для конвертации по умолчанию
  convertedAmount: number = 0;
  lastUpdated: string = '';
  selectedMode: string = ''; // Выбранный режим обмена
  exchangeRatesByMode: ExchangeRatesByMode = {}; // Хранение курсов по режимам
  showMore: boolean = false;
  
  transactionType: string = 'buy';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchExchangeRates(); // Загружаем курсы при инициализации компонента
  }
  get ratesCount(): number {
    return this.exchangeRatesByMode[this.selectedMode]?.length || 0;
  }
  // Получение курсов обмена с сервера
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

  // Парсинг XML данных
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

  // Логика получения пути к флагу по коду валюты
  getFlag(currency: string): string {
    switch (currency) {
      case 'USD': return '../../assets/icons/usd.svg';
      case 'EUR': return '../../assets/icons/euro.svg';
      case 'RUB': return '../../assets/icons/rub.svg';
      case 'KZT': return '../../../assets/icons/kzt.png';
      case 'TJS': return '../../assets/icons/tjs.svg';
      default: return '../../assets/icons/default.svg'; // Значение по умолчанию
    }
  }

  // Функция для преобразования режимов в удобочитаемые строки
  getReadableMode(mode: string): string {
    switch (mode) {
      case 'CASH': return 'В кассе';
      case 'REMITTANCE_RATE': return 'Денежные переводы';
      case 'CB_RATE': return 'НБТ';
      default: return mode;
    }
  }

  // Функция для получения списка режимов
  getModes(): string[] {
    return ['REMITTANCE_RATE', 'CASH', 'CB_RATE']; // Возвращаем только нужные режимы
  }

  // Функция для выбора режима
  selectMode(mode: string) {
    this.selectedMode = mode;
    this.updateCurrencies(); // Обновляем валюты после выбора режима
  }

  // Обновляем валюты после выбора режима
  updateCurrencies() {
    if (this.selectedMode) {
      const rates = this.exchangeRatesByMode[this.selectedMode]; // Получаем курсы для выбранного режима
      if (rates.length > 0) {
        // Убедимся, что при переключении режима валюты корректно выбираются
        if (this.transactionType === 'buy') {
          this.fromCurrency = 'TJS';
          this.toCurrency = rates.find(rate => rate.currency !== 'TJS')?.currency || rates[0].currency;
        } else {
          this.fromCurrency = rates.find(rate => rate.currency !== 'TJS')?.currency || rates[0].currency;
          this.toCurrency = 'TJS';
        }
        this.convertCurrency(); // Выполняем конвертацию
      }
    }
  }

  // Функция для конвертации валют
  setTransactionType(type: string) {
    this.transactionType = type;
    this.updateCurrencySelection(); // Обновляем выбор валют после изменения типа транзакции
    this.convertCurrency();
  }

  // Метод для переключения состояния при каждом клике
  toggleTransaction(): void {
    this.transactionType = this.transactionType === 'buy' ? 'sell' : 'buy';
    this.updateCurrencySelection(); // Обновляем выбор валют после переключения типа транзакции
    this.convertCurrency();

    // Запуск анимации
    const anim = document.querySelector('animate');
    if (anim) {
      (anim as any).beginElement(); // Запуск анимации
    }
  }

  // Обновление выбора валют для поддержания корректного обмена
  updateCurrencySelection() {
    if (this.transactionType === 'buy') {
      // Если покупаем, выбираем любую валюту для покупки, но платим Сомони
      this.fromCurrency = 'TJS';
      const rates = this.exchangeRatesByMode[this.selectedMode];
      this.toCurrency = rates.find(rate => rate.currency !== 'TJS')?.currency || '';
    } else {
      // Если продаем, выбираем любую валюту для продажи и получаем Сомони
      const rates = this.exchangeRatesByMode[this.selectedMode];
      this.fromCurrency = rates.find(rate => rate.currency !== 'TJS')?.currency || '';
      this.toCurrency = 'TJS';
    }
  }

  // Функция для конвертации валют
  convertCurrency() {
    if (this.fromCurrency === this.toCurrency) {
      this.convertedAmount = 0; // Нельзя конвертировать одну и ту же валюту
      return;
    }

    if (this.transactionType === 'buy') {
      // Покупаем валюту за сомони
      const toRate = this.exchangeRatesByMode[this.selectedMode]?.find(rate => rate.currency === this.toCurrency);
      if (toRate) {
        this.convertedAmount = this.amount / toRate.sell;
      } else {
        this.convertedAmount = 0; // Если курсы не найдены
      }
    } else {
      // Продаем валюту и получаем сомони
      const fromRate = this.exchangeRatesByMode[this.selectedMode]?.find(rate => rate.currency === this.fromCurrency);
      if (fromRate) {
        this.convertedAmount = this.amount * fromRate.buy;
      } else {
        this.convertedAmount = 0; // Если курсы не найдены
      }
    }
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  // Отправка денег (эмуляция)
  sendMoney() {
    alert(`Вы отправили ${this.convertedAmount.toFixed(2)} ${this.toCurrency}`);
  }
}