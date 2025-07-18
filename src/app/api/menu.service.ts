import { Injectable } from '@angular/core';
import {HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguagesService } from '../languages.service';
import { switchMap, map } from 'rxjs/operators';
import { MainGalleries, MenusResponse } from '../models/menu.model';
import { BehaviorSubject } from 'rxjs';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})

export class MenuService {
  private baseUrl = environment.BASE_URL
private personTypeIdSource = new BehaviorSubject<number>(1);
currentPersonTypeId = this.personTypeIdSource.asObservable();
  constructor(private http: HttpClient, private languageService:LanguagesService) { }
  private sortBySortId<T extends { sort_id: number }>(items: T[]): T[] {
    return items.sort((a, b) => a.sort_id - b.sort_id);
  }

  changePersonTypeId(id: number) {

    this.personTypeIdSource.next(id);
  }

  getCurrentPersonTypeId(): number {
    return this.personTypeIdSource.getValue();
  }
  getMenu(): Observable<MenusResponse> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<MenusResponse>(`${this.baseUrl}/menu/list`, { headers });
      }),
      map(response => {
        // Сортируем `menus` и вложенные элементы `items` и `favorites` по `sort_id`
        if (response.data.menus && Array.isArray(response.data.menus)) {
          response.data.menus = this.sortBySortId(response.data.menus).map(menu => {
            if (Array.isArray(menu.items)) {
              menu.items = this.sortBySortId(menu.items);
            }
            if (Array.isArray(menu.favorites)) {
              menu.favorites = this.sortBySortId(menu.favorites);
            }
            return menu;
          });
        }
        return response;
      })
    );
  }
  getMainGalleries(): Observable<MainGalleries> {
  
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<MainGalleries>(`${this.baseUrl}/main-gallery/list`, { headers });
      }),
      map(response => {
        if (response.data.main_galleries && Array.isArray(response.data.main_galleries)) {
          response.data.main_galleries = this.sortBySortId(response.data.main_galleries);
        }
        return response;
      })
    );
  }



}
