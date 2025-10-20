import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap, map } from 'rxjs/operators';

import { DepositDetail, DepositsList, postDeposit } from '../models/deposit.model';
import { environment } from '../../environments/environment';
import { fileResponse } from '../models/vacancies.model';
@Injectable({
  providedIn: 'root',
})
export class DepositsService {
  private baseUrl = environment.BASE_URL;
  private http = inject(HttpClient);
  private languageService = inject(LanguagesService);
  private sortBySortId<T extends { sort_id: number }>(items: T[]): T[] {
    return items.sort((a, b) => a.sort_id - b.sort_id);
  }

  getDepositsListAll(): Observable<DepositsList> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          Accept: 'application/json',
          Language: lang,
        });
        const url = `${this.baseUrl}/deposit/list`;
        return this.http.get<DepositsList>(url, { headers });
      }),
      map((response) => {
        if (response.data.deposits && Array.isArray(response.data.deposits)) {
          // Сортируем сначала карты по sortId
          response.data.deposits = this.sortBySortId(response.data.deposits).map((deposit) => {
            if (Array.isArray(deposit.content_item)) {
              deposit.content_item = this.sortBySortId(deposit.content_item);
            }
            return deposit;
          });
        }
        return response;
      }),
    );
  }

  getDepositData(cardId: number): Observable<DepositDetail> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<DepositDetail>(`${this.baseUrl}/deposit/${cardId}`, { headers });
      }),
      map((response) => {
        if (response.data) {
          const depositData = response.data;

          // Сортируем currency, если это массив
          if (Array.isArray(depositData.currency)) {
            depositData.currency = this.sortBySortId(depositData.currency);

            // Для каждого элемента currency сортируем tariffs
            depositData.currency.forEach((currencyItem) => {
              if (Array.isArray(currencyItem.tariffs)) {
                currencyItem.tariffs = this.sortBySortId(currencyItem.tariffs);
              }
            });
          }

          // Сортируем documents, если это массив
          if (Array.isArray(depositData.documents)) {
            depositData.documents = this.sortBySortId(depositData.documents);
          }

          // Сортируем faqs, если это массив
          if (Array.isArray(depositData.faqs)) {
            depositData.faqs = this.sortBySortId(depositData.faqs);
          }
        }
        return response;
      }),
    );
  }

  submitDeposit(cardData: postDeposit): Observable<fileResponse> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          Accept: 'application/json',
          Language: lang, // Динамическая установка языкового заголовка
        });

        return this.http.post<fileResponse>(this.baseUrl + '/deposit/order/save', cardData, { headers });
      }),
    );
  }
}
