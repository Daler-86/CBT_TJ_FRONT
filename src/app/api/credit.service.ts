import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LanguagesService } from '../languages.service';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CreditDocument, CreditList, CreditTariff, creditTariff } from '../models/credit.model';
@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private baseUrl = 'http://172.16.16.88:9009/api/v1'
  constructor(private http: HttpClient, private languageService:LanguagesService) { }

  getCreditList(cardId: number):Observable<CreditList>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<CreditList>(this.baseUrl+'/credit/list/'+cardId, { headers });
     }) )
  }

  getCreditTariff(cardId: number):Observable<CreditTariff>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<CreditTariff>(this.baseUrl+'/credit/tariff/'+cardId, { headers });
     }) )
  }
  getCreditDocument(cardId: number):Observable<CreditDocument>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<CreditDocument>(this.baseUrl+'/credit/document/'+cardId, { headers });
     }) )
  }


  submitCredit(creditData: any): Observable<any> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'Accept': 'application/json',
          'Language': lang  // Динамическая установка языкового заголовка
        });
        
         return this.http.post(this.baseUrl+'/credit/order/save', creditData, { headers });
      })
    );
  }
  
}
