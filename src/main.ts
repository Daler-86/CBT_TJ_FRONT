/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslation } from './config/translate-loader.config';

import { MapComponent } from './app/components/map/map.component';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';
import { BehaviorSubject } from 'rxjs';

registerLocaleData(localeRu, 'ru-RU');
export const config$ = new BehaviorSubject<YaConfig>({
  apikey: 'bcce0b1c-0648-4d55-88bd-b9fdd5230427',
});
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    importProvidersFrom(AngularYandexMapsModule.forRoot(config$))
  ]
}).catch(err => console.error(err));
