import { Component, inject } from '@angular/core';
// import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { transition } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from "./components/modal/modal.component";
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators'; // Импортируем оператор filter
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, TranslateModule, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})


export class AppComponent {
  private router = inject(Router);
   constructor(private translate: TranslateService) {
    this.router.events.pipe(
      // 3. Нас интересует только событие NavigationEnd (успешное завершение навигации)
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // 4. При каждом успешном переходе прокручиваем окно на самый верх
      window.scrollTo(0, 0);
    });
    
  }
ngOnInit():void{
let savedLanguage = localStorage.getItem('appLanguage');
   if(savedLanguage){
      this.translate.setDefaultLang(savedLanguage);
    }
    else{
       this.translate.setDefaultLang('1');
      this.translate.use('1');
    }
}
  
}
