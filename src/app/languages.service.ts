import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
    private language = new BehaviorSubject<string>('1');  // Default language is Tajik
  
    // Observable for watching language changes
    public language$ = this.language.asObservable();
  
    constructor() {
      // Load saved language from localStorage if available
      const savedLanguage = localStorage.getItem('appLanguage');
      if (savedLanguage) {
        this.language.next(savedLanguage);
      }
    }
  
    setLanguage(lang: string) {
      console.log(lang);
      this.language.next(lang); // Update the current language
      localStorage.setItem('appLanguage', lang); // Save the language to localStorage
    }
  }
  