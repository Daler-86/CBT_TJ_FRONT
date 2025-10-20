// src/app/api/application.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LanguagesService } from '../languages.service';
import { SimpleApplicationPayload } from '../models/bank-detail.model';
import { environment } from '../../environments/environment';
import { fileResponse } from '../models/vacancies.model';
// import { LanguageService } from './language.service'; // Предполагаем, что у тебя есть такой сервис
// import { SimpleApplicationPayload } from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);
  private languageService = inject(LanguagesService);
  private baseUrl = environment.BASE_URL;
  // Универсальный метод отправки формы
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
