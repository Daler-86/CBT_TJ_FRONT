import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap,map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { TransferDetail, TransfersList } from '../models/transfers.model';
import { BankDetailCurrency, BankDetails } from '../models/bank-detail.model';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class BankDetailsService {
  private baseUrl = environment.BASE_URL
  constructor(private http: HttpClient, private languageService:LanguagesService) { }
  private sortBySortId<T extends { sort_id: number }>(items: T[]): T[] {
    return items.sort((a, b) => a.sort_id - b.sort_id);
  }

  private selectedCardSource = new BehaviorSubject<any>(null);
  selectedCard$ = this.selectedCardSource.asObservable();
  setSelectedCard(card: any) {
    this.selectedCardSource.next(card);
  }

  getBankDetails(id:number): Observable<BankDetails> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'Accept': 'application/json',
          'Language': lang
        });
        const url = `${this.baseUrl}/bank-detail/list/${id}`;
        return this.http.get<BankDetails>(url, { headers });
      }),
      map(response => {
        if (response.data.bank_details && Array.isArray(response.data.bank_details)) {
          // Сортируем сначала карты по sortId
          response.data.bank_details = this.sortBySortId(response.data.bank_details);


        }
        return response;
      })
    );
  }
  getBankDetailCurrency(): Observable<BankDetailCurrency> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'Accept': 'application/json',
          'Language': lang
        });
        const url = `${this.baseUrl}/bank-detail/currency`;
        return this.http.get<BankDetailCurrency>(url, { headers });
      }),
      map(response => {
        if (response.data.bank_detail_currencies && Array.isArray(response.data.bank_detail_currencies)) {
          // Сортируем сначала карты по sortId
          response.data.bank_detail_currencies = this.sortBySortId(response.data.bank_detail_currencies);


        }
        return response;
      })
    );
  }



}
