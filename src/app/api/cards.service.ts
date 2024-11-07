import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CardBrand, CardList,CardBrandsResponse, CardContentItem, CardHelpfulDocument, CardLimits, CardOperations, CardServices, CardFaqs } from '../models/cards.model';
import { LanguagesService } from '../languages.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private baseUrl = 'http://172.16.16.88:9009/api/v1'
  constructor(private http: HttpClient, private languageService:LanguagesService) { }

  getCardList(personTypeId: number, brandId: number): Observable<CardList> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'Accept': 'application/json',
          'Language': lang  // Setting the dynamic language header
        });
        const url = `${this.baseUrl+'/card/by-brand/'+personTypeId}/${brandId}`;
        return this.http.get<CardList>(url, { headers });
      })
    );
  }
  getCardBrands():Observable<CardBrandsResponse>{
    return this.languageService.language$.pipe(  switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<CardBrandsResponse>(this.baseUrl+'/card/brands', { headers });
  }))
  }
  getCardContentItem(cardId: number):Observable<CardContentItem>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<CardContentItem>(this.baseUrl+'/card/content-items/'+cardId, { headers });
     }) )
  }
  getCardhDocuments(cardId:number):Observable<CardHelpfulDocument>{
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
    return this.http.get<CardHelpfulDocument>(`${this.baseUrl+'/card/h-documents/'}${cardId}`, { headers });
      }))
  }
  getCardLinits(cardId:number):Observable<CardLimits>{

    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
    return this.http.get<CardLimits>(`${this.baseUrl+'/card/limits/'}${cardId}`, { headers });
      }))
  }
  getCardOperation(cardId:number):Observable<CardOperations>{

    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
    return this.http.get<CardOperations>(`${this.baseUrl+'/card/operations/'}${cardId}`, { headers });
      }))
  }
  getCardServices(cardId:number):Observable<CardServices>{
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
    
    return this.http.get<CardServices>(`${this.baseUrl+'/card/services/'}${cardId}`, { headers });
  }
      ))
  }
  getCardFaqs(cardId:number):Observable<CardFaqs>{
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
    
    return this.http.get<CardFaqs>(`${this.baseUrl+"/card/faqs/"}${cardId}`, { headers });
  }
      ))
  }
  // getCardByBrand(cardId:number):Observable<CardList>{
  //   return this.languageService.language$.pipe(
  //     switchMap(lang => {
  //       const headers = new HttpHeaders({
  //         'accept': 'application/json',
  //         'Language': lang  // Установка динамического заголовка
  //       });
    
  //   return this.http.get<CardList>(`${this.baseUrl+'/card/by-brand/'}${cardId}/${}`, { headers });
  // }
  //     ))
  // }
  submitCardByBrand(cardData: any): Observable<any> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'Accept': 'application/json',
          'Language': lang  // Динамическая установка языкового заголовка
        });
        
         return this.http.post(this.baseUrl+'/card/order/save', cardData, { headers });
      })
    );
  }
}


