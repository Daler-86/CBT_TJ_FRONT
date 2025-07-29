import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom,LOCALE_ID } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core'; 
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { routes } from './app.routes';
import { provideTranslation } from '../config/translate-loader.config';
import { OverlayModule } from '@angular/cdk/overlay';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, withInMemoryScrolling, withHashLocation } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { YaConfig,AngularYandexMapsModule } from 'angular8-yandex-maps';

registerLocaleData(localeRu);
export const config$ = new BehaviorSubject<YaConfig>({
  apikey: 'cffa96ad-c08f-4eed-85b7-41d311f064c6',
});
export const appConfig: ApplicationConfig = {
  

  providers: [
    provideRouter(routes,
        withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    })
    ),
    provideHttpClient(), // подключение HttpClientModule
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    provideAnimations() ,
    importProvidersFrom(ReactiveFormsModule),
    { provide: LOCALE_ID, useValue: 'ru-RU' },
    importProvidersFrom(AngularYandexMapsModule.forRoot(config$))
  ]
};

