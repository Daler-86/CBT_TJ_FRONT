import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { routes } from './app.routes';
import { provideTranslation } from '../config/translate-loader.config';
import { OverlayModule } from '@angular/cdk/overlay';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, withInMemoryScrolling, withHashLocation } from '@angular/router';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,  withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    })
    ),
    provideHttpClient(), // подключение HttpClientModule
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    provideAnimations() ,
    importProvidersFrom(ReactiveFormsModule)

  ]
};

