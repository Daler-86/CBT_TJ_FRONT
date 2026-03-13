import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguagesService } from '../languages.service';
import { switchMap, map } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { CreditData, CreditDocument, CreditList, CreditTariff, creditDataSubmit } from '../models/credit.model';
import { environment } from '../../environments/environment';
import { fileResponse } from '../models/vacancies.model';
@Injectable({
  providedIn: 'root',
})
export class CreditService {
  private baseUrl = environment.BASE_URL;
  private http = inject(HttpClient);
  private languageService = inject(LanguagesService);
  private sortBySortId<T extends { sort_id: number }>(items: T[]): T[] {
    return items.sort((a, b) => a.sort_id - b.sort_id);
  }
  getCreditList(personTypeId: number): Observable<CreditList> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<CreditList>(`${this.baseUrl}/credit/list/${personTypeId}`, { headers });
      }),
      map((response) => {
        if (response.data.credits && Array.isArray(response.data.credits)) {
          response.data.credits = this.sortBySortId(response.data.credits).map((credit) => {
            if (Array.isArray(credit.content)) {
              credit.content = this.sortBySortId(credit.content);
            }
            return credit;
          });
        }
        return response;
      }),
    );
  }
  getCreditTariff(cardId: number): Observable<CreditTariff> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<CreditTariff>(`${this.baseUrl}/credit/tariff/${cardId}`, { headers });
      }),
      map((response) => {
        if (response.data.credit_tariffs && Array.isArray(response.data.credit_tariffs)) {
          response.data.credit_tariffs = this.sortBySortId(response.data.credit_tariffs).map((tariff) => {
            if (Array.isArray(tariff.items)) {
              tariff.items = this.sortBySortId(tariff.items);
            }
            return tariff;
          });
        }
        return response;
      }),
    );
  }
  getCreditDocument(cardId: number): Observable<CreditDocument> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<CreditDocument>(`${this.baseUrl}/credit/document/${cardId}`, { headers });
      }),
      map((response) => {
        if (response.data.credit_documents && Array.isArray(response.data.credit_documents)) {
          response.data.credit_documents = this.sortBySortId(response.data.credit_documents);
        }
        return response;
      }),
    );
  }

  getCreditData(cardId: number): Observable<CreditData> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<CreditData>(`${this.baseUrl}/credit/${cardId}`, { headers });
      }),
    );
  }

  submitCredit(creditData: creditDataSubmit): Observable<fileResponse> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          Accept: 'application/json',
          Language: lang, 
        });

        return this.http.post<fileResponse>(this.baseUrl + '/credit/order/save', creditData, { headers });
      }),
    );
  }
}
