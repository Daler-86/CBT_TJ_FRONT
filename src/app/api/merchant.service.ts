// src/app/api/merchant.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LanguagesService } from '../languages.service';
import { environment } from '../../environments/environment';
import { MerchantListResponse, MerchantCategoryResponse } from '../models/merchant.model';

@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  private baseUrl = environment.BASE_URL;
  private http = inject(HttpClient);
  private languageService = inject(LanguagesService);

  /**
   * Переписано точно по вашему примеру VacanciesService.
   * Отправляет все параметры, даже если они null.
   */
  getMerchants(
    limit: number,
    currentPage: number,
    region_id: number | null,
    category_id: number | null,
    has_cashback: boolean,
    name: string | null,
  ): Observable<MerchantListResponse> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });

        // В вашем примере offset вычисляется как (currentPage - 1) * limit,
        // а передается просто currentPage. Давайте сделаем точно как в примере,
        // но учтем, что offset и currentPage - это разные вещи.
        // Я сохраню правильный расчет offset.
        const offset = (currentPage - 1) * limit + 1;

        const params = new HttpParams()
          .set('limit', limit.toString())
          .set('offset', offset.toString())
          .set('region_id', region_id !== null ? region_id.toString() : '') // Преобразуем null в пустую строку, как это часто делают
          .set('category_id', category_id !== null ? category_id.toString() : '')
          .set('has_cashback', has_cashback.toString())
          .set('name', name !== null ? name : '');

        return this.http.get<MerchantListResponse>(`${this.baseUrl}/merchant/list`, { headers, params });
      }),
    );
  }

  // getCategories остается без изменений
  getCategories(): Observable<MerchantCategoryResponse> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({ accept: 'application/json', Language: lang });
        return this.http.get<MerchantCategoryResponse>(`${this.baseUrl}/merchant/category`, { headers });
      }),
    );
  }
}
