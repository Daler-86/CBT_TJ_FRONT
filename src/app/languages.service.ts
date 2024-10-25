import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
  private language = new BehaviorSubject<string>('1');  // Default language is Tajik

  // Observable for watching language changes
  public language$ = this.language.asObservable();

  constructor() {}

  setLanguage(lang: string) {
    console.log(lang)
    this.language.next(lang);
  }
}
