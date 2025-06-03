import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap, map } from 'rxjs/operators';
import { VacancyCategory, VacancyContent,VacancyGallery,VacancyItem, VacancyStatistic,VacancyList, PersonalQuality, VacancyCondition, VacancyEducation, VacancyExperience, VacancySkill, VacancyData } from '../models/vacancies.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VacanciesService {

  private baseUrl=environment.BASE_URL
  constructor(private http: HttpClient, private languageService:LanguagesService) { }
  private sortBySortId<T extends { sort_id: number }>(items: T[]): T[] {
    return items.sort((a, b) => a.sort_id - b.sort_id);
  }

  getVacancyContentItem(): Observable<VacancyItem> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<VacancyItem>(this.baseUrl + '/vacancy/item', { headers });
      }),
      map(response => {
        response.data.vacancy_content_items = this.sortBySortId(response.data.vacancy_content_items);
        return response;
      })
    );
  }

  getPersonalQuality(cardId: number): Observable<PersonalQuality> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<PersonalQuality>(`${this.baseUrl}/vacancy/personal-quality/${cardId}`, { headers });
      }),
      map(response => {
        response.data.vacancy_personal_qualities = this.sortBySortId(response.data.vacancy_personal_qualities);
        return response;
      })
    );
  }

  getVacancyCondition(cardId: number): Observable<VacancyCondition> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<VacancyCondition>(`${this.baseUrl}/vacancy/condition/${cardId}`, { headers });
      }),
      map(response => {
        response.data.vacancy_conditions = this.sortBySortId(response.data.vacancy_conditions);
        return response;
      })
    );
  }

  getVacancyEducation(cardId: number): Observable<VacancyEducation> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<VacancyEducation>(`${this.baseUrl}/vacancy/education/${cardId}`, { headers });
      }),
      map(response => {
        response.data.vacancy_educations = this.sortBySortId(response.data.vacancy_educations);
        return response;
      })
    );
  }

  getVacancyExperience(cardId: number): Observable<VacancyExperience> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<VacancyExperience>(`${this.baseUrl}/vacancy/experience/${cardId}`, { headers });
      }),
      map(response => {
        response.data.vacancy_experiences = this.sortBySortId(response.data.vacancy_experiences);
        return response;
      })
    );
  }

  getVacancySkill(cardId: number): Observable<VacancySkill> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<VacancySkill>(`${this.baseUrl}/vacancy/skill/${cardId}`, { headers });
      }),
      map(response => {
        response.data.vacancy_skills = this.sortBySortId(response.data.vacancy_skills);
        return response;
      })
    );
  }

  getVacancyContent(): Observable<VacancyContent> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
        return this.http.get<VacancyContent>(this.baseUrl+"/vacancy/content", { headers });
      })
    );
  }



  getVacancyStatistic():Observable<VacancyStatistic> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
        return this.http.get<VacancyStatistic>(this.baseUrl+"/vacancy/statistic", { headers });
      })
    );
  }

  getVacancyGallery():Observable<VacancyGallery> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
        return this.http.get<VacancyGallery>(this.baseUrl+'/vacancy/gallery', { headers });
      })
    );
  }

  getVacancyCategory():Observable<VacancyCategory> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        return this.http.get<VacancyCategory>(this.baseUrl+'/vacancy/category', { headers });
      })
    );
  }

  getVacancyList(limit:number,currentPage:number,category_id:number,region_id:number):Observable<VacancyList> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });
        const params = new HttpParams()
        .set('limit', limit)
        .set('offset', currentPage)
        .set('region_id', region_id)
        .set('category_id', category_id)
        return this.http.get<VacancyList>(this.baseUrl+'/vacancy/list', { headers, params });
      })
    );
  }



  getVacancyData(cardId:number):Observable<VacancyData> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang
        });

        return this.http.get<VacancyData>(this.baseUrl+'/vacancy/'+cardId, { headers });
      })
    );
  }

  getVacancyByCategory(cardId: number,limit:number,currentPage:number):Observable<VacancyList>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
      const params = new HttpParams()
      .set('limit', limit)
      .set('offset', currentPage)
      .set('region_id',cardId)
    return this.http.get<VacancyList>(`${this.baseUrl+'/vacancy/by-category-id'}`, { headers,params });
     }) )
  }

  getVacancyByRegion(cardId: number,limit:number,currentPage:number):Observable<VacancyList>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
      const params = new HttpParams()
      .set('limit', limit)
      .set('offset', currentPage)
      .set('region_id',cardId)
    return this.http.get<VacancyList>(`${this.baseUrl+'/vacancy/by-region-id'}`, { headers,params });
     }) )
  }

  uploadFile(file: File): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'accept': 'application/json'
    });

    return this.http.post(this.baseUrl+'/file/upload', uploadData, { headers });
  }

  submitFormData(formData: any): Observable<any> {
    return this.http.post(this.baseUrl+'/vacancy/order/save', formData);
  }

}
