import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap, map } from 'rxjs/operators';
import { TenderData, TenderdetailData } from '../models/tender.model';



@Injectable({
  providedIn: 'root'
})
export class TenderService {

  private baseUrl='http://172.16.16.88:9009/api/v1'
  constructor(private http: HttpClient, private languageService:LanguagesService) { }
  private sortBySortId<T extends { sort_id: number }>(items: T[]): T[] {
    return items.sort((a, b) => a.sort_id - b.sort_id);
  }

  getTenderList(limit:number,currentPage:number):Observable<TenderData> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  
        });
        const params = new HttpParams()
        .set('limit', limit)
        .set('offset', currentPage)
        return this.http.get<TenderData>(this.baseUrl+'/tender/list', { headers, params });
      })
    );
  } 

  getTenderDetailData(cardId: number): Observable<TenderdetailData> { 
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<TenderdetailData>(`${this.baseUrl}/tender/${cardId}`, { headers });
      }),
      map(response => {
        if (response.data.tender) {
          const tenderDetailData = response.data.tender;
  
          if (Array.isArray(tenderDetailData.information)) {
            tenderDetailData.information = this.sortBySortId(tenderDetailData.information);
      
          }
  
     
        }
        return response;
      })
    );
  }

}