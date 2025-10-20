// src/app/services/breadcrumb.service.ts
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$: Observable<Breadcrumb[]> = this._breadcrumbs$.asObservable();
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  constructor() {
    this.listenToEvents(); // Вызываем единый метод прослушки
  }

  private listenToEvents(): void {
    // 1. Слушаем навигацию роутера
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        // При каждом переходе по странице ПЫТАЕМСЯ перестроить крошки
        this.rebuildBreadcrumbs();
      });

    // 2. Слушаем события ngx-translate
    // onLangChange срабатывает и при ПЕРВОЙ загрузке языка, и при каждой смене.
    this.translate.onLangChange.subscribe(() => {
      // Когда язык точно загружен, мы ОБЯЗАТЕЛЬНО перестраиваем крошки
      this.rebuildBreadcrumbs();
    });
  }

  /**
   * Центральный метод, который пересобирает хлебные крошки.
   */
  private rebuildBreadcrumbs(): void {
    // Проверяем, есть ли уже загруженные переводы. Если нет, ничего не делаем.
    // Это предотвращает запуск до того, как ngx-translate будет готов.
    if (Object.keys(this.translate.instant('breadcrumbs')).length === 0) {
      return; // Ждем, пока onLangChange не вызовет этот метод снова
    }

    const root = this.activatedRoute.root;
    const breadcrumbs = this.buildBreadcrumbs(root);

    const currentUrl = this.router.url;
    const isHomePage = currentUrl === '/home' || currentUrl === '/';

    if (!isHomePage && breadcrumbs.length > 0) {
      const homeCrumb: Breadcrumb = {
        label: this.translate.instant('BREADCRUMBS.HOME'),
        url: '/',
      };
      breadcrumbs.unshift(homeCrumb);
    }

    const uniqueCrumbs = this.removeDuplicates(breadcrumbs);
    this._breadcrumbs$.next(uniqueCrumbs);
  }

  // Метод buildBreadcrumbs и removeDuplicates остаются такими же, как в прошлом ответе
  private buildBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    let currentRoute: ActivatedRoute | null = route.firstChild;
    let newUrl = url;
    while (currentRoute) {
      const routeURL: string = currentRoute.snapshot.url.map((segment) => segment.path).join('/');
      if (routeURL !== '') {
        newUrl += `/${routeURL}`;
      }
      const label = currentRoute.snapshot.data['breadcrumb'];
      if (label) {
        const isDynamic = currentRoute.snapshot.data['isDynamic'];
        const finalLabel = !isDynamic ? this.translate.instant(label) : label;
        if (finalLabel && finalLabel.trim() !== '') {
          breadcrumbs.push({ label: finalLabel, url: newUrl });
        }
      }
      currentRoute = currentRoute.firstChild;
    }
    return breadcrumbs;
  }

  private removeDuplicates(breadcrumbs: Breadcrumb[]): Breadcrumb[] {
    const seen = new Set<string>();
    return breadcrumbs.filter((crumb) => {
      const duplicate = seen.has(crumb.label);
      seen.add(crumb.label);
      return !duplicate;
    });
  }
}
