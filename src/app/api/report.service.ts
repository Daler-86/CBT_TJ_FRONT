import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap } from 'rxjs/operators';
import { ReportData, ReportFile } from '../models/report.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private baseUrl = environment.BASE_URL;
  private http = inject(HttpClient);
  private languageService = inject(LanguagesService);

  getReportFile(limit: number, currentPage: number): Observable<ReportFile> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        const params = new HttpParams().set('limit', limit).set('offset', currentPage);
        return this.http.get<ReportFile>(this.baseUrl + '/report/file', { headers, params });
      }),
    );
  }

  getReportData(year?: number): Observable<ReportData> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });

        return this.http.get<ReportData>(this.baseUrl + '/report/data-by-year/' + year, { headers });
      }),
    );
  }
}
