// src/app/api/contact.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LanguagesService } from '../languages.service';
import { environment } from '../../environments/environment';
import { ContactResponse, ContactBlock } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = environment.BASE_URL;

  constructor(private http: HttpClient, private languageService: LanguagesService) { }

  getContacts(): Observable<ContactResponse> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<ContactResponse>(`${this.baseUrl}/contact/list`, { headers });
      }),
      // Добавим сортировку сразу в сервисе
      map(response => {
        // Сортируем основные блоки
        response.data.contacts.sort((a, b) => a.sort_id - b.sort_id);
        // Сортируем вложенные данные в каждом блоке
        response.data.contacts.forEach(block => {
          block.data.sort((a, b) => a.sort_id - b.sort_id);
        });
        return response;
      })
    );
  }
}