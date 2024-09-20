import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CardBrand, CardList,CardBrandsResponse, CardContentItem, CardHelpfulDocument, CardLimits, CardOperations, CardServices } from '../models/cards.model';
@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private apiUrlCardList = 'http://172.16.16.88:9009/api/v1/card/list';
  private apiUrlCardBrands="http://172.16.16.88:9009/api/v1/card/brands";
  private apiUrlCardByBrand="http://172.16.16.88:9009/api/v1/card/by-brand/{id}";
  private apiUrlCardByType="http://172.16.16.88:9009/api/v1/card/by-type/{id}";
  private apiUrlCardContentItems="http://172.16.16.88:9009/api/v1/card/content-items/";
  private apiUrlCardhDocuments="http://172.16.16.88:9009/api/v1/card/h-documents/";
  private apiUrlCardLimits="http://172.16.16.88:9009/api/v1/card/limits/";
  private apiUrlCardOperations="http://172.16.16.88:9009/api/v1/card/operations/";
  private apiUrlCardServices="http://172.16.16.88:9009/api/v1/card/services/";
  private apiUrlCardTypes="http://172.16.16.88:9009/api/v1/card/types";

  constructor(private http: HttpClient) { }

 getCardList(): Observable<CardList> {
  
  const headers = new HttpHeaders({
    'accept': 'application/json',  // Указываем формат, который мы ожидаем
    'Language': '1'  // Ваш кастомный заголовок
  });
  return this.http.get<CardList>(this.apiUrlCardList, { headers });
}


  getCardBrands():Observable<CardBrandsResponse>{
    const headers = new HttpHeaders({
      'accept': 'application/json',  // Указываем формат, который мы ожидаем
      'Language': '1'  // Ваш кастомный заголовок
    });
    return this.http.get<CardBrandsResponse>(this.apiUrlCardBrands, { headers });
  }
 
  getCardContentItem(cardId: number):Observable<CardContentItem>{
   
    const headers = new HttpHeaders({
      'accept': 'application/json',  // Указываем формат, который мы ожидаем
      'Language': '1'  // Ваш кастомный заголовок
    });
    return this.http.get<CardContentItem>(`${this.apiUrlCardContentItems}${cardId}`, { headers });

  }
 
  getCardhDocuments(cardId:number):Observable<CardHelpfulDocument>{
    console.log(cardId)
    const headers = new HttpHeaders({
      'accept': 'application/json',  // Указываем формат, который мы ожидаем
      'Language': '1'  // Ваш кастомный заголовок
    });
    return this.http.get<CardHelpfulDocument>(`${this.apiUrlCardhDocuments}${cardId}`, { headers });

  }
  getCardLinits(cardId:number):Observable<CardLimits>{

    const headers = new HttpHeaders({
      'accept': 'application/json',  // Указываем формат, который мы ожидаем
      'Language': '1'  // Ваш кастомный заголовок
    });
    return this.http.get<CardLimits>(`${this.apiUrlCardLimits}${cardId}`, { headers });

  }
  getCardOperation(cardId:number):Observable<CardOperations>{

    const headers = new HttpHeaders({
      'accept': 'application/json',  // Указываем формат, который мы ожидаем
      'Language': '1'  // Ваш кастомный заголовок
    });
    return this.http.get<CardOperations>(`${this.apiUrlCardOperations}${cardId}`, { headers });

  }
  getCardServices(cardId:number):Observable<CardServices>{

    const headers = new HttpHeaders({
      'accept': 'application/json',  // Указываем формат, который мы ожидаем
      'Language': '1'  // Ваш кастомный заголовок
    });
    return this.http.get<CardServices>(`${this.apiUrlCardServices}${cardId}`, { headers });

  }


}


