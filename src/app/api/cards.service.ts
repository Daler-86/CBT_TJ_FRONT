import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CardBrand, CardList,CardBrandsResponse, CardContentItem, CardHelpfulDocument, CardLimits, CardOperations, CardServices, CardFaqs, CardDetail } from '../models/cards.model';
import { LanguagesService } from '../languages.service';
import { switchMap,map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private baseUrl = 'http://172.16.16.88:9009/api/v1'
  constructor(private http: HttpClient, private languageService:LanguagesService) { }
  private sortBySortId<T extends { sort_id: number }>(items: T[]): T[] {
    return items.sort((a, b) => a.sort_id - b.sort_id);
  }

  private selectedCardSource = new BehaviorSubject<any>(null);
  selectedCard$ = this.selectedCardSource.asObservable();
  setSelectedCard(card: any) {
    this.selectedCardSource.next(card);
  }
  getCardList(personTypeId: number, brandId: number): Observable<CardList> { 
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'Accept': 'application/json',
          'Language': lang
        });
        const url = `${this.baseUrl}/card/by-brand/${personTypeId}/${brandId}`;
        return this.http.get<CardList>(url, { headers });
      }),
      map(response => {
        if (response.data.cards && Array.isArray(response.data.cards)) {
          // Сортируем сначала карты по sortId
          response.data.cards = this.sortBySortId(response.data.cards);
          
          // Сортируем контент каждой карты по sortId
          response.data.cards.forEach(card => {
            if (Array.isArray(card.content)) {
              card.content = this.sortBySortId(card.content);
            }
          });
        }
        return response;
      })
    );
  }
  getCardData(cardId: number): Observable<CardDetail> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<CardDetail>(`${this.baseUrl}/card/${cardId}`, { headers });
      }),
      map(response => response) // Теперь здесь нет изменения данных, просто возвращаем полученный ответ
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
  getCardContentItem(cardId: number): Observable<CardContentItem> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<CardContentItem>(this.baseUrl + '/card/content-items/' + cardId, { headers });
      }),
      map(response => {
        if (response.data.card_content_items) {
          response.data.card_content_items = this.sortBySortId(response.data.card_content_items);
        }
        return response;
      })
    );
  }
  
  getCardhDocuments(cardId: number): Observable<CardHelpfulDocument> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<CardHelpfulDocument>(`${this.baseUrl}/card/h-documents/${cardId}`, { headers });
      }),
      map(response => {
        if (response.data['card-helpful-documents']) {
          response.data['card-helpful-documents'] = this.sortBySortId(response.data['card-helpful-documents']);
        }
        return response;
      })
    );
  }
  
  getCardLimits(cardId: number): Observable<CardLimits> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<CardLimits>(`${this.baseUrl}/card/limits/${cardId}`, { headers });
      }),
      map(response => {
        if (response.data.card_limits) {
          response.data.card_limits = this.sortBySortId(response.data.card_limits);
        }
        return response;
      })
    );
  }
  
  getCardOperation(cardId: number): Observable<CardOperations> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<CardOperations>(`${this.baseUrl}/card/operations/${cardId}`, { headers });
      }),
      map(response => {
        if (response.data.card_operations) {
          response.data.card_operations = this.sortBySortId(response.data.card_operations);
        }
        return response;
      })
    );
  }
  
  getCardServices(cardId: number): Observable<CardServices> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<CardServices>(`${this.baseUrl}/card/services/${cardId}`, { headers });
      }),
      map(response => {
        if (response.data.card_services) {
          response.data.card_services = this.sortBySortId(response.data.card_services);
        }
        return response;
      })
    );
  }
  getCardFaqs(cardId: number): Observable<CardFaqs> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<CardFaqs>(`${this.baseUrl}/card/faqs/${cardId}`, { headers });
      }),
      map(response => {
        if (response.data.card_faqs) {
          response.data.card_faqs = this.sortBySortId(response.data.card_faqs);
        }
        return response;
      })
    );
  }
  

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


