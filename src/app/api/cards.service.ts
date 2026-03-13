import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import {
  CardList,
  CardBrandsResponse,
  CardContentItem,
  CardHelpfulDocument,
  CardLimits,
  CardOperations,
  CardServices,
  CardFaqs,
  CardDetail,
  cardDetail,
} from '../models/cards.model';
import { LanguagesService } from '../languages.service';
import { switchMap, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { fileResponse } from '../models/vacancies.model';
@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private baseUrl = environment.BASE_URL;
  private http = inject(HttpClient);
  private languageService = inject(LanguagesService);
  private sortBySortId<T extends { sort_id: number }>(items: T[]): T[] {
    return items.sort((a, b) => a.sort_id - b.sort_id);
  }

  getCardListAll(personTypeId: number): Observable<CardList> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          Accept: 'application/json',
          Language: lang,
        });
        const url = `${this.baseUrl}/card/list/${personTypeId}`;
        return this.http.get<CardList>(url, { headers });
      }),
      map((response) => {
        if (response.data.cards && Array.isArray(response.data.cards)) {
          response.data.cards = this.sortBySortId(response.data.cards);

          response.data.cards.forEach((card) => {
            if (Array.isArray(card.content)) {
              card.content = this.sortBySortId(card.content);
            }
          });
        }
        return response;
      }),
    );
  }

  getCardList(personTypeId: number, brandId: number): Observable<CardList> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          Accept: 'application/json',
          Language: lang,
        });
        const url = `${this.baseUrl}/card/by-brand/${personTypeId}/${brandId}`;
        return this.http.get<CardList>(url, { headers });
      }),
      map((response) => {
        if (response.data.cards && Array.isArray(response.data.cards)) {
          response.data.cards = this.sortBySortId(response.data.cards);

          response.data.cards.forEach((card) => {
            if (Array.isArray(card.content)) {
              card.content = this.sortBySortId(card.content);
            }
          });
        }
        return response;
      }),
    );
  }

  getCardData(cardId: number): Observable<CardDetail> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<CardDetail>(`${this.baseUrl}/card/${cardId}`, { headers });
      }),
      map((response) => response), 
    );
  }

  getCardBrands(): Observable<CardBrandsResponse> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang, 
        });
        return this.http.get<CardBrandsResponse>(this.baseUrl + '/card/brands', { headers });
      }),
    );
  }
  getCardContentItem(cardId: number): Observable<CardContentItem> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<CardContentItem>(this.baseUrl + '/card/content-items/' + cardId, { headers });
      }),
      map((response) => {
        if (response.data.card_content_items) {
          response.data.card_content_items = this.sortBySortId(response.data.card_content_items);
        }
        return response;
      }),
    );
  }

  getCardhDocuments(cardId: number): Observable<CardHelpfulDocument> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<CardHelpfulDocument>(`${this.baseUrl}/card/h-documents/${cardId}`, { headers });
      }),
      map((response) => {
        if (response.data['card-helpful-documents']) {
          response.data['card-helpful-documents'] = this.sortBySortId(response.data['card-helpful-documents']);
        }
        return response;
      }),
    );
  }

  getCardLimits(cardId: number): Observable<CardLimits> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<CardLimits>(`${this.baseUrl}/card/limits/${cardId}`, { headers });
      }),
      map((response) => {
        if (response.data.card_limits) {
          response.data.card_limits = this.sortBySortId(response.data.card_limits);
        }
        return response;
      }),
    );
  }

  getCardOperation(cardId: number): Observable<CardOperations> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<CardOperations>(`${this.baseUrl}/card/operations/${cardId}`, { headers });
      }),
      map((response) => {
        if (response.data.card_operations) {
          response.data.card_operations = this.sortBySortId(response.data.card_operations);
        }
        return response;
      }),
    );
  }

  getCardServices(cardId: number): Observable<CardServices> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<CardServices>(`${this.baseUrl}/card/services/${cardId}`, { headers });
      }),
      map((response) => {
        if (response.data.card_services) {
          response.data.card_services = this.sortBySortId(response.data.card_services);
        }
        return response;
      }),
    );
  }
  getCardFaqs(cardId: number): Observable<CardFaqs> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<CardFaqs>(`${this.baseUrl}/card/faqs/${cardId}`, { headers });
      }),
      map((response) => {
        if (response.data.card_faqs) {
          response.data.card_faqs = this.sortBySortId(response.data.card_faqs);
        }
        return response;
      }),
    );
  }

  submitCardByBrand(cardData: cardDetail): Observable<fileResponse> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          Accept: 'application/json',
          Language: lang, 
        });

        return this.http.post<fileResponse>(this.baseUrl + '/card/order/save', cardData, { headers });
      }),
    );
  }
}
