import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap } from 'rxjs/operators';
import { VacancyCategory, VacancyContent,VacancyGallery,VacancyItem, VacancyStatistic,VacancyList, PersonalQuality, VacancyCondition, VacancyEducation, VacancyExperience, VacancySkill } from '../models/vacancies.model';

@Injectable({
  providedIn: 'root'
})
export class VacanciesService {

private apiUrlVacancyContent ="http://172.16.16.88:9009/api/v1/vacancy/content"
private apiUrlVacancyItem='http://172.16.16.88:9009/api/v1/vacancy/item'
private apiUrlVacancyStatistic="http://172.16.16.88:9009/api/v1/vacancy/statistic"
private apiUrlVacancyGallery="http://172.16.16.88:9009/api/v1/vacancy/gallery"
private apiUrlVacancyCategory="http://172.16.16.88:9009/api/v1/vacancy/category"
private apiUrlVacancyList="http://172.16.16.88:9009/api/v1/vacancy/list"

private apiUrlVacancyPersonalQuality='http://172.16.16.88:9009/api/v1/vacancy/personal-quality/'
private apiUrlVacancyCondition="http://172.16.16.88:9009/api/v1/vacancy/condition/"
private apiUrlVacancyEducation="http://172.16.16.88:9009/api/v1/vacancy/education/"
private apiUrlVacancyExperience="http://172.16.16.88:9009/api/v1/vacancy/experience/"
private apiUrlVacancySkill="http://172.16.16.88:9009/api/v1/vacancy/skill/"

private apiUrlVacancyByCategory="http://172.16.16.88:9009/api/v1/vacancy/by-category-id/"
private apiUrlVacancyByRegion="http://172.16.16.88:9009/api/v1/vacancy/by-region-id/"

  constructor(private http: HttpClient, private languageService:LanguagesService) { }

  getVacancyContent(): Observable<VacancyContent> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
        return this.http.get<VacancyContent>(this.apiUrlVacancyContent, { headers });
      })
    );
  }

  getVacancyContentItem(): Observable<VacancyItem> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  // Установка динамического заголовка
        });
        return this.http.get<VacancyItem>(this.apiUrlVacancyItem, { headers });
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
        return this.http.get<VacancyStatistic>(this.apiUrlVacancyStatistic, { headers });
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
        return this.http.get<VacancyGallery>(this.apiUrlVacancyGallery, { headers });
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
        return this.http.get<VacancyCategory>(this.apiUrlVacancyCategory, { headers });
      })
    );
  } 

  getVacancyList():Observable<VacancyList> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  
        });
        return this.http.get<VacancyList>(this.apiUrlVacancyList, { headers });
      })
    );
  } 



  
  getPersonalQuality(cardId: number):Observable<PersonalQuality>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<PersonalQuality>(`${this.apiUrlVacancyPersonalQuality}${cardId}`, { headers });
     }) )
  }
  getVacancyCondition(cardId: number):Observable<VacancyCondition>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<VacancyCondition>(`${this.apiUrlVacancyCondition}${cardId}`, { headers });
     }) )
  }
  
  getVacancyEducation(cardId: number):Observable<VacancyEducation>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<VacancyEducation>(`${this.apiUrlVacancyEducation}${cardId}`, { headers });
     }) )
  }

  getVacancyExperience(cardId: number):Observable<VacancyExperience>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<VacancyExperience>(`${this.apiUrlVacancyExperience}${cardId}`, { headers });
     }) )
  }
  getVacancySkill(cardId: number):Observable<VacancySkill>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<VacancySkill>(`${this.apiUrlVacancySkill}${cardId}`, { headers });
     }) )
  }

  getVacancyByCategory(cardId: number):Observable<VacancyList>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<VacancyList>(`${this.apiUrlVacancyByCategory}${cardId}`, { headers });
     }) )
  }
  
  getVacancyByRegion(cardId: number):Observable<VacancyList>{
    return this.languageService.language$.pipe(

 switchMap(lang => {
      const headers = new HttpHeaders({
        'accept': 'application/json',
        'Language': lang  // Установка динамического заголовка
      });
    return this.http.get<VacancyList>(`${this.apiUrlVacancyByRegion}${cardId}`, { headers });
     }) )
  }
  

}
