import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
interface ExchangeRate {
  currency: string;
  buy: number;
  sell: number;
  flag: string;
}

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [TranslateModule, FormsModule,NgFor, CommonModule],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss'
})

export class CurrencyConverterComponent {
  amount: number = 0;
  fromCurrency: string = 'USD';
  toCurrency: string = 'TJS';
  convertedAmount: number = 0;
  lastUpdated: string = '01 января 2024';
  
  exchangeRates: ExchangeRate[] = [
    { currency: 'USD', buy: 10.8900, sell: 10.9700, flag: '../../assets/icons/usd.svg' },
    { currency: 'RUB', buy: 0.1190, sell: 0.1210, flag: '../../assets/icons/rub.svg' },
    { currency: 'EUR', buy: 11.6500, sell: 12.2000, flag: '../../assets/icons/euro.svg' }
  ];

  convertCurrency() {
    const fromRate = this.exchangeRates.find(rate => rate.currency === this.fromCurrency);
    const toRate = this.exchangeRates.find(rate => rate.currency === this.toCurrency);

    if (fromRate && toRate) {
      this.convertedAmount = (this.amount * fromRate.sell) / toRate.buy;
    }
  }

  sendMoney() {
    alert(`Вы отправили ${this.convertedAmount.toFixed(2)} ${this.toCurrency}`);
  }
}
