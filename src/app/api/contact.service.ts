
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { LanguagesService } from '../languages.service';
import { environment } from '../../environments/environment';
import { ContactResponse, ContactPayload } from '../models/contact.model';
import { fileResponse } from '../models/vacancies.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private baseUrl = environment.BASE_URL;
  private http = inject(HttpClient);
  private languageService = inject(LanguagesService);

  getContacts(): Observable<ContactResponse> {
    return this.languageService.language$.pipe(
      switchMap((lang) => {
        const headers = new HttpHeaders({
          accept: 'application/json',
          Language: lang,
        });
        return this.http.get<ContactResponse>(`${this.baseUrl}/contact/list`, { headers });
      }),

      map((response) => {
        response.data.contacts.sort((a, b) => a.sort_id - b.sort_id);
        response.data.contacts.forEach((block) => {
          block.data.sort((a, b) => a.sort_id - b.sort_id);
        });
        return response;
      }),
    );
  }
  submitContactForm(formData: ContactPayload): Observable<fileResponse> {
    return this.languageService.language$.pipe(
      take(1),
      switchMap((lang) => {
        const headers = new HttpHeaders({
          Accept: 'application/json',
          Language: lang,
        });

        const apiUrl = this.baseUrl + '/contact/help/save'; 
        return this.http.post<fileResponse>(apiUrl, formData, { headers });
      }),
    );
  }
}
