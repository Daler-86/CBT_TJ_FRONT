import { Routes } from '@angular/router';
import { PrivateClientsComponent } from './components/private-clients/private-clients.component';
import { BusinessComponent } from './components/business/business.component';
import { MobileBankingComponent } from './components/mobile-banking/mobile-banking.component';
import { VacanciesComponent } from './components/vacancies/vacancies.component';
import { MoreComponent } from './components/more/more.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'private-clients', component: PrivateClientsComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'mobile-banking', component: MobileBankingComponent },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'more', component: MoreComponent }
];

