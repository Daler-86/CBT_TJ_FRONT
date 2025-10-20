import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { rkoResponce, scsDetailResponse } from '../models/rko.model';
@Injectable({
  providedIn: 'root',
})
export class RkoService {
  private baseUrl = environment.BASE_URL;
  private http = inject(HttpClient);
  private languageService = inject(LanguagesService);
  private sortBySortId<T extends { sort_id: number }>(items: T[]): T[] {
    return items.sort((a, b) => a.sort_id - b.sort_id);
  }

  getRKOListAll(): Observable<rkoResponce> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          Accept: 'application/json',
          Language: lang,
        });
        const url = `${this.baseUrl}/scs/list`;
        return this.http.get<rkoResponce>(url, { headers });
      }),
      map((response) => {
        if (response.data.scss && Array.isArray(response.data.scss)) {
          // Сортируем сначала карты по sortId
          response.data.scss = this.sortBySortId(response.data.scss).map((rko) => {
            if (Array.isArray(rko.scs_item)) {
              rko.scs_item = this.sortBySortId(rko.scs_item);
            }
            return rko;
          });
        }
        return response;
      }),
    );
  }

  getRkoDetails(cardId: number): Observable<scsDetailResponse> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<scsDetailResponse>(`${this.baseUrl}/scs/${cardId}`, { headers });
      }),
      map((response) => {
        if (response.data) {
          const depositData = response.data;

          // Сортируем currency, если это массив
          if (Array.isArray(depositData.advantages)) {
            depositData.advantages = this.sortBySortId(depositData.advantages);
          }
          // Сортируем currency, если это массив
          if (Array.isArray(depositData.conditions)) {
            depositData.conditions = this.sortBySortId(depositData.conditions);

            // Для каждого элемента currency сортируем tariffs
            depositData.conditions.forEach((currencyItem) => {
              if (Array.isArray(currencyItem.items)) {
                currencyItem.items = this.sortBySortId(currencyItem.items);
              }
            });
          }
        }
        return response;
      }),
    );
  }
}
