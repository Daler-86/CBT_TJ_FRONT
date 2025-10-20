import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Languages } from './shared/enums/languages.enum';
@Injectable({
  providedIn: 'root',
})
export class LanguagesService {
  private language = new BehaviorSubject<Languages>(Languages.Tj); // Default language is Tajik

  // Observable for watching language changes
  public language$ = this.language.asObservable();

  constructor() {
    // Load saved language from localStorage if available
    const savedLanguage = (localStorage.getItem('appLanguage') as Languages) || Languages.Tj;
    if (savedLanguage) {
      this.language.next(savedLanguage);
    }
  }

  setLanguage(lang: Languages) {
    this.language.next(lang); // Update the current language
    localStorage.setItem('appLanguage', lang); // Save the language to localStorage
  }
}
