import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap,map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { TransferDetail, TransfersList } from '../models/transfers.model';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class TransfersService {
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

  getTransfersListAll(): Observable<TransfersList> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'Accept': 'application/json',
          'Language': lang
        });
        const url = `${this.baseUrl}/transfer/list`;
        return this.http.get<TransfersList>(url, { headers });
      }),
      map(response => {
        if (response.data.transfers && Array.isArray(response.data.transfers)) {
          // Сортируем сначала карты по sortId
          response.data.transfers = this.sortBySortId(response.data.transfers);


        }
        return response;
      })
    );
  }

  getTransferData(cardId: number): Observable<TransferDetail> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<TransferDetail>(`${this.baseUrl}/transfer/${cardId}`, { headers });
      }),
      map(response => {
        if (response.data.transfer_data) {
          const transferData = response.data.transfer_data;

          if (Array.isArray(transferData.conditions)) {
            transferData.conditions = this.sortBySortId(transferData.conditions);
            transferData.conditions.forEach(condition => {
              if (Array.isArray(condition.items)) {
                condition.items = this.sortBySortId(condition.items);
              }
            });
          }

          if (Array.isArray(transferData.documents)) {
            transferData.documents = this.sortBySortId(transferData.documents);
            transferData.documents.forEach(document => {
              if (Array.isArray(document.items)) {
                document.items = this.sortBySortId(document.items);
              }
            });
          }
        }
        return response;
      })
    );
  }

}
