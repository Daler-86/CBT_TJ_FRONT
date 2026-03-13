import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap, map } from 'rxjs/operators';
import { NewsData, NewsDetailData } from '../models/news.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private baseUrl = environment.BASE_URL;
  private http = inject(HttpClient);
  private languageService = inject(LanguagesService);


  getNewsList(limit: number, currentPage: number): Observable<NewsData> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        const params = new HttpParams().set('limit', limit).set('offset', currentPage);
        return this.http.get<NewsData>(this.baseUrl + '/news/list', { headers, params });
      }),
    );
  }

  getNewsDetailData(cardId: number): Observable<NewsDetailData> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<NewsDetailData>(`${this.baseUrl}/news/${cardId}`, { headers });
      }),
      map((response) => {
 
        return response;
      }),
    );
  }
}
