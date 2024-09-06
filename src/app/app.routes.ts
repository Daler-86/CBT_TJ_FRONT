import { Routes } from '@angular/router';
import { PrivateClientsComponent } from './components/private-clients/private-clients.component';
import { BusinessComponent } from './components/business/business.component';
import { MobileBankingComponent } from './components/mobile-banking/mobile-banking.component';
import { VacanciesComponent } from './components/vacancies/vacancies.component';
import { HomeComponent } from './home/home.component';
import { CardsComponent } from './components/cards/cards.component';
import { VisaGoldComponent } from './components/visa-gold/visa-gold.component';
import { CreditComponent } from './components/credit/credit.component';
import { VisaPlatinumComponent } from './components/visa-platinum/visa-platinum.component';
import { MilliCard1Component } from './components/milli-card-1/milli-card-1.component';
import { MilliCard2Component } from './components/milli-card-2/milli-card-2.component';
import { VacancyListComponent } from './components/vacancy-list/vacancy-list.component';
import { VacancyDetailComponent } from './components/vacancy-detail/vacancy-detail.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'private-clients', component: PrivateClientsComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'mobile-banking', component: MobileBankingComponent },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'cards', component: CardsComponent },
  { path: 'visa-gold', component: VisaGoldComponent },
  { path: 'visa-platinum', component: VisaPlatinumComponent },
  { path: 'credit', component: CreditComponent },
  { path: 'milli-card-1', component: MilliCard1Component },
  { path: 'milli-card-2', component: MilliCard2Component },
  {path:'vacancy-list', component:VacancyListComponent},
  { path: 'vacancy-list/:id', component: VacancyDetailComponent }
];



