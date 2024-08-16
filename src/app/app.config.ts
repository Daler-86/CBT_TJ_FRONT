import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideTranslation } from '../config/translate-loader.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // подключение HttpClientModule
    importProvidersFrom(TranslateModule.forRoot(provideTranslation()))
  ]
};

