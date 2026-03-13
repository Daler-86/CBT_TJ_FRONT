import { Languages } from './../../shared/enums/languages.enum';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterModule } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule, RouterModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit, OnDestroy {
  lang = Languages;
  currentYear: number = new Date().getFullYear();

  public logoSrc = '../../../assets/icons/logo_tj_big.png'; 

  private langChangeSubscription: Subscription | undefined;
  private translateService = inject(TranslateService);

  ngOnInit(): void {
    this.updateLogo(this.translateService.currentLang);
    this.langChangeSubscription = this.translateService.onLangChange.subscribe((event: { lang: string }) => {
      this.updateLogo(event.lang);
    });
  }

  updateLogo(lang: string): void {
    switch (lang) {
      case this.lang.Tj: 
        this.logoSrc = '../../../assets/icons/logo_tj_big.png';
        break;
      case this.lang.Ru: 
        this.logoSrc = '../../../assets/icons/logo_ru_big.png';
        break;
      case this.lang.En: 
        this.logoSrc = '../../../assets/icons/logo_en_big.png';
        break;
      default:
        this.logoSrc = '../../../assets/icons/logo_tj_big.png'; 
    }
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}
