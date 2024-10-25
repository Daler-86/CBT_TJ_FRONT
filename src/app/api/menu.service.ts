import { Injectable } from '@angular/core';
import {HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguagesService } from '../languages.service';
import { switchMap } from 'rxjs/operators';
import { MainGalleries } from '../models/menu.model';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class MenuService {
  private baseUrl = 'http://172.16.16.88:9009/api/v1'
private personTypeIdSource = new BehaviorSubject<number>(1);
currentPersonTypeId = this.personTypeIdSource.asObservable();
  constructor(private http: HttpClient, private languageService:LanguagesService) { }


  changePersonTypeId(id: number) {

    this.personTypeIdSource.next(id);
  }

  getCurrentPersonTypeId(): number {
    return this.personTypeIdSource.getValue();
  }
  getMenu(): Observable<any> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
        return this.http.get<any>(this.baseUrl+'/menu/list', { headers });
      })
    );
  }
  getMainGalleries(): Observable<MainGalleries> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
        return this.http.get<MainGalleries>(this.baseUrl+'/main-gallery/list', { headers });
      })
    );
  }



}