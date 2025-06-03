import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap, map } from 'rxjs/operators';
import { TenderData, TenderdetailData } from '../models/tender.model';
import { NewsData, NewsDetailData } from '../models/news.model';



@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private baseUrl='http://172.16.16.88:9009/api/v1'
  constructor(private http: HttpClient, private languageService:LanguagesService) { }
  private sortBySortId<T extends { sort_id: number }>(items: T[]): T[] {
    return items.sort((a, b) => a.sort_id - b.sort_id);
  }

  getNewsList(limit:number,currentPage:number):Observable<NewsData> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  
        });
        const params = new HttpParams()
        .set('limit', limit)
        .set('offset', currentPage)
        return this.http.get<NewsData>(this.baseUrl+'/news/list', { headers, params });
      })
    );
  } 

  getNewsDetailData(cardId: number): Observable<NewsDetailData> { 
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<NewsDetailData>(`${this.baseUrl}/news/${cardId}`, { headers });
      }),
      map(response => {
        if (response.data.news) {
          const tenderDetailData = response.data.news;
  
        
  
     
        }
        return response;
      })
    );
  }

}