
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

  private dynamicLabels: { [key: string]: string } = {};
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  constructor() {
    this.listenToEvents();
  }
  setLabel(url: string, label: string) {
    this.dynamicLabels[url] = label;
    this.rebuildBreadcrumbs();
  }

  private listenToEvents(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.rebuildBreadcrumbs();
      });

    this.translate.onLangChange.subscribe(() => {
      this.rebuildBreadcrumbs();
    });
  }

  public rebuildBreadcrumbs(): void {
    if (Object.keys(this.translate.instant('breadcrumbs') || {}).length === 0 && this.translate.currentLang) {
    }

    const root = this.activatedRoute.root;
    const breadcrumbs = this.buildBreadcrumbs(root);

    const currentUrl = this.router.url;
    if (currentUrl !== '/' && currentUrl !== '/home') {
      breadcrumbs.unshift({
        label: this.translate.instant('BREADCRUMBS.HOME'),
        url: '/',
      });
    }

    this._breadcrumbs$.next(this.removeDuplicates(breadcrumbs));
  }
  private buildBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    let currentRoute: ActivatedRoute | null = route.firstChild;
    let newUrl = url;

    while (currentRoute) {
      const routeURL: string = currentRoute.snapshot.url.map((segment) => segment.path).join('/');
      if (routeURL !== '') {
        newUrl += `/${routeURL}`;
      }

      const data = currentRoute.snapshot.data;
      const labelKey = data['breadcrumb'];

      if (labelKey) {
        let finalLabel = '';

        if (this.dynamicLabels[newUrl]) {
          finalLabel = this.dynamicLabels[newUrl];
        } else if (!data['isDynamic']) {
          finalLabel = this.translate.instant(labelKey);
        } else {
          finalLabel = labelKey;
        }

        if (finalLabel) {
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
