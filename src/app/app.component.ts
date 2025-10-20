import { Component, inject, OnInit } from '@angular/core';
// import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from './components/modal/modal.component';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators'; // Импортируем оператор filter
import { PageTitleService } from './services/page-title.service';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { Languages } from './shared/enums/languages.enum';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, TranslateModule, ModalComponent, BreadcrumbsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private translate = inject(TranslateService);
  private pageTitleService = inject(PageTitleService);

  constructor() {
    this.router.events
      .pipe(
        // 3. Нас интересует только событие NavigationEnd (успешное завершение навигации)
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        // 4. При каждом успешном переходе прокручиваем окно на самый верх
        window.scrollTo(0, 0);
      });
  }
  ngOnInit(): void {
    this.pageTitleService.init();
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage) {
      this.translate.setDefaultLang(savedLanguage);
      this.pageTitleService.init();
    } else {
      this.translate.setDefaultLang(Languages.Tj);
      this.translate.use(Languages.Tj);
    }
  }
}
