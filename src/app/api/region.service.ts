import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap, map } from 'rxjs/operators';
import { FilteredByRegion, FilteredData, OfficeFaqs, OfficeList, RegionList } from '../models/region.model';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class RegionService {
  private sortBySortId<T extends { sort_id: number }>(items: T[]): T[] {
    return items.sort((a, b) => a.sort_id - b.sort_id);
  }
  private http = inject(HttpClient);
  private languageService = inject(LanguagesService);
  private baseUrl = environment.BASE_URL;

  getRegionList(): Observable<RegionList> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<RegionList>(this.baseUrl + '/region/list', { headers });
      }),
    );
  }
  getOfficeList(): Observable<OfficeList> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<OfficeList>(this.baseUrl + '/office/list', { headers });
      }),
    );
  }

  getFilteredData(
    atms: boolean,
    is24Time: boolean,
    offices: boolean,
    regionId: number,
    terminals: boolean,
    workingNow: boolean,
  ): Observable<FilteredData> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          Accept: 'application/json',
          Language: lang,
        });

        const params = new HttpParams()
          .set('atms', atms)
          .set('is_24_time', is24Time)
          .set('offices', offices)
          .set('region_id', regionId)
          .set('terminals', terminals)
          .set('working_now', workingNow);

        const url = `${this.baseUrl}/office/search`; 

        return this.http.get<FilteredData>(url, { headers, params });
      }),
    );
  }
  getFilteredByRegion(
    atms: boolean,
    offices: boolean,
    terminals: boolean,
    regionId: number,
    limit: number,
    offset: number,
  ): Observable<FilteredByRegion> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          Accept: 'application/json',
          Language: lang,
        });

        const params = new HttpParams()
          .set('atms', atms)
          .set('offices', offices)
          .set('region_id', regionId)
          .set('terminals', terminals)
          .set('limit', limit)
          .set('offset', offset);

        const url = `${this.baseUrl}/office/by-region`; 

        return this.http.get<FilteredByRegion>(url, { headers, params });
      }),
    );
  }
  getCardFaqs(): Observable<OfficeFaqs> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<OfficeFaqs>(`${this.baseUrl}/office/faqs`, { headers });
      }),
      map((response) => {
        if (response.data.office_faqs) {
          response.data.office_faqs = this.sortBySortId(response.data.office_faqs);
        }
        return response;
      }),
    );
  }
}
