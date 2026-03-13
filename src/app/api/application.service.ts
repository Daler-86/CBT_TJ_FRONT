import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LanguagesService } from '../languages.service';
import { SimpleApplicationPayload } from '../models/bank-detail.model';
import { environment } from '../../environments/environment';
import { fileResponse } from '../models/vacancies.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);
  private languageService = inject(LanguagesService);
  private baseUrl = environment.BASE_URL;
  submitForm(apiUrl: string, formData: SimpleApplicationPayload): Observable<fileResponse> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          Accept: 'application/json',
          Language: lang,
        });
        return this.http.post<fileResponse>(this.baseUrl + apiUrl, formData, { headers });
      }),
    );
  }
}
