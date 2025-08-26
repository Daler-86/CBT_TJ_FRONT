import { Languages } from './../../shared/enums/languages.enum';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
// Для ссылки на главную
import { CommonModule } from '@angular/common'; // Для *ngIf


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule, RouterModule, RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit, OnDestroy {
  lang = Languages;
  currentYear: number = new Date().getFullYear();

  public logoSrc: string = '../../../assets/icons/logo_tj_big.png'; // Лого по умолчанию

  private langChangeSubscription: Subscription | undefined;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    // 1. Устанавливаем логотип при первой загрузке
    this.updateLogo(this.translateService.currentLang);

    // 2. Подписываемся на событие смены языка
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      (event: { lang: string }) => {
        // При каждой смене языка вызываем наш метод для обновления логотипа
        this.updateLogo(event.lang);
      }
    );
  }

  // Метод, который выбирает правильный логотип
  updateLogo(lang: string): void {
    switch (lang) {
      case this.lang.Tj: // Тоҷикӣ
        this.logoSrc = '../../../assets/icons/logo_tj_big.png';
        break;
      case this.lang.Ru: // Русский
        this.logoSrc = '../../../assets/icons/logo_ru_big.png';
        break;
      case this.lang.En: // English
        this.logoSrc = '../../../assets/icons/logo_en_big.png';
        break;
      default:
        this.logoSrc = '../../../assets/icons/logo_tj_big.png'; // Фолбэк на русский
    }
  }

  ngOnDestroy(): void {
    // Обязательно отписываемся, чтобы избежать утечек памяти
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}
