import { Routes } from '@angular/router';
import { PrivateClientsComponent } from './components/private-clients/private-clients.component';
import { BusinessComponent } from './components/business/business.component';
import { MobileBankingComponent } from './components/mobile-banking/mobile-banking.component';
import { VacanciesComponent } from './components/vacancies/vacancies.component';
import { HomeComponent } from './components/home/home.component';
import { CardsComponent } from './components/cards/cards.component';

import { CreditComponent } from './components/credit/credit.component';

import { VacancyListComponent } from './components/vacancy-list/vacancy-list.component';
import { VacancyDetailComponent } from './components/vacancy-detail/vacancy-detail.component';
import { CardDetailsComponent } from './components/card-details/card-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'private-clients', component: PrivateClientsComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'mobile-banking', component: MobileBankingComponent },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'cards', component: CardsComponent },
  { path: 'credit', component: CreditComponent },
  {path:'vacancy-list', component:VacancyListComponent},
  { path: 'vacancy-list/:id', component: VacancyDetailComponent },
  { path: 'card-details/:id', component: CardDetailsComponent }
];



