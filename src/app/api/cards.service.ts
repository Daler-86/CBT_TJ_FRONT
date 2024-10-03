import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CardBrand, CardList,CardBrandsResponse, CardContentItem, CardHelpfulDocument, CardLimits, CardOperations, CardServices, CardFaqs } from '../models/cards.model';
import { LanguagesService } from '../languages.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private apiUrlCardList = 'http://172.16.16.88:9009/api/v1/card/list';
  private apiUrlCardBrands="http://172.16.16.88:9009/api/v1/card/by-brand/1";
  private apiUrlCardByBrand="http://172.16.16.88:9009/api/v1/card/by-brand/";
  private apiUrlCardByType="http://172.16.16.88:9009/api/v1/card/by-type/{id}";
  private apiUrlCardContentItems="http://172.16.16.88:9009/api/v1/card/content-items/";
  private apiUrlCardhDocuments="http://172.16.16.88:9009/api/v1/card/h-documents/";
  private apiUrlCardLimits="http://172.16.16.88:9009/api/v1/card/limits/";
  private apiUrlCardOperations="http://172.16.16.88:9009/api/v1/card/operations/";
  private apiUrlCardServices="http://172.16.16.88:9009/api/v1/card/services/";
  private apiUrlCardTypes="http://172.16.16.88:9009/api/v1/card/types";
  private apiUrlCardFaqs="http://172.16.16.88:9009/api/v1/card/faqs/"

  constructor(private http: HttpClient, private languageService:LanguagesService) { }

  getCardList(): Observable<CardList> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
        return this.http.get<CardList>(this.apiUrlCardList, { headers });
      })
    );
  }
  getCardBrands():Observable<CardBrandsResponse>{
    return this.languageService.language$.pipe(  switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<CardBrandsResponse>(this.apiUrlCardBrands, { headers });
  }))
  }
  getCardContentItem(cardId: number):Observable<CardContentItem>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<CardContentItem>(`${this.apiUrlCardContentItems}${cardId}`, { headers });
     }) )
  }
  getCardhDocuments(cardId:number):Observable<CardHelpfulDocument>{
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
    return this.http.get<CardHelpfulDocument>(`${this.apiUrlCardhDocuments}${cardId}`, { headers });
      }))
  }


  getCardLinits(cardId:number):Observable<CardLimits>{

    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
    return this.http.get<CardLimits>(`${this.apiUrlCardLimits}${cardId}`, { headers });
      }))
  }
  getCardOperation(cardId:number):Observable<CardOperations>{

    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
    return this.http.get<CardOperations>(`${this.apiUrlCardOperations}${cardId}`, { headers });
      }))
  }
  getCardServices(cardId:number):Observable<CardServices>{
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
    
    return this.http.get<CardServices>(`${this.apiUrlCardServices}${cardId}`, { headers });
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
    
    return this.http.get<CardFaqs>(`${this.apiUrlCardFaqs}${cardId}`, { headers });
  }
      ))
  }

  getCardByBrand(cardId:number):Observable<CardList>{
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
    
    return this.http.get<CardList>(`${this.apiUrlCardByBrand}${cardId}`, { headers });
  }
      ))
  }
}


