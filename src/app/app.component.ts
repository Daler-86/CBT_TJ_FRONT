import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from './components/modal/modal.component';
import { RouterOutlet } from '@angular/router';
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
  private translate = inject(TranslateService);
  private pageTitleService = inject(PageTitleService);

  constructor() {}

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
