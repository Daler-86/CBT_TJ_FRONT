import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LanguagesService } from '../languages.service';
import { switchMap } from 'rxjs/operators';
import { RegionList } from '../models/region.model';
@Injectable({
  providedIn: 'root'
})

export class RegionService {
  private apiUrlRegionList="http://172.16.16.88:9009/api/v1/region/list"
  
  constructor(private http: HttpClient, private languageService:LanguagesService) { }
  getRegionList():Observable<RegionList> {
    return this.languageService.language$.pipe(
      switchMap(lang => {
        const headers = new HttpHeaders({
          'accept': 'application/json',
          'Language': lang  
        });
        return this.http.get<RegionList>(this.apiUrlRegionList, { headers });
      })
    );
  }
}
