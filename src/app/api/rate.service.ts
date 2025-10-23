import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, ApiRate, ExchangeRatesByMode, ProcessedData } from '../models/rate.model';

@Injectable({
  providedIn: 'root',
})
export class RateService {
  private apiUrl = `${environment.BASE_URL}`;
  private http = inject(HttpClient);

  /**
   * Получает и обрабатывает курсы валют.
   * @returns Observable, который эмитит готовые для отображения данные.
   */
  getProcessedExchangeRates(): Observable<ProcessedData> {
    // Делаем GET-запрос и указываем, что ожидаем ответ типа ApiResponse
    return this.http.get<ApiResponse>(this.apiUrl + '/rate/list').pipe(
      // Используем оператор map для трансформации полученных данных
      map((response) => {
        const ratesByMode: ExchangeRatesByMode = {};
        const lastUpdated = response.data.last_update;
        const apiRates = response.data.rates.rate;

        apiRates.forEach((rate: ApiRate) => {
          if (!ratesByMode[rate.mode]) {
            ratesByMode[rate.mode] = [];
          }

          ratesByMode[rate.mode].push({
            currency: rate.cur,
            buy: parseFloat(rate.buy) || 0, // Преобразуем строку в число
            sell: parseFloat(rate.sell) || 0,
            flag: this.getFlag(rate.cur), // Получаем флаг
          });
        });

        // Возвращаем обработанный объект
        return { ratesByMode, lastUpdated };
      }),
    );
  }
  getFlag(currency: string): string {
    switch (currency) {
      case 'USD':
        return '../../assets/icons/usd.svg';
      case 'EUR':
        return '../../assets/icons/euro.svg';
      case 'RUB':
        return '../../assets/icons/rub.svg';
      case 'KZT':
        return '../../../assets/icons/kzt.png';
      case 'TJS':
        return '../../assets/icons/tjs.svg';
      default:
        return '../../assets/icons/default.svg';
    }
  }
}
