// src/app/services/page-title.service.ts
import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {
  private lastStaticTitleKey: string | null = null;
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private translateService = inject(TranslateService);

  public init(): void {
    // 1. Обработка статических заголовков при навигации
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        switchMap((route) => route.data),
      )
      .subscribe((data) => {
        if (data['titleKey']) {
          this.updateTitleFromKey(data['titleKey']);
        }
      });

    // 2. Обработка смены языка для статических заголовков
    this.translateService.onLangChange.subscribe(() => {
      if (this.lastStaticTitleKey) {
        this.updateTitleFromKey(this.lastStaticTitleKey);
      }
    });
  }

  public setCustomTitle(pageTitle: string): void {
    this.lastStaticTitleKey = null;
    this.translateService.get('titles.siteName').subscribe((siteName) => {
      this.titleService.setTitle(`${pageTitle} | ${siteName}`);
    });
  }

  private updateTitleFromKey(titleKey: string): void {
    this.lastStaticTitleKey = titleKey;
    this.translateService.get([titleKey, 'titles.siteName']).subscribe((translations) => {
      const pageTitle = translations[titleKey];
      const siteName = translations['titles.siteName'];

      if (titleKey === 'titles.default') {
        this.titleService.setTitle(siteName);
      } else {
        this.titleService.setTitle(`${pageTitle} | ${siteName}`);
      }
    });
  }
}
