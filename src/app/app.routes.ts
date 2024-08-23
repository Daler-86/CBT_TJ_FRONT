import { Routes } from '@angular/router';
import { PrivateClientsComponent } from './components/private-clients/private-clients.component';
import { BusinessComponent } from './components/business/business.component';
import { MobileBankingComponent } from './components/mobile-banking/mobile-banking.component';
import { VacanciesComponent } from './components/vacancies/vacancies.component';
import { HomeComponent } from './home/home.component';
import { CardsComponent } from './components/cards/cards.component';
import { VisaGoldComponent } from './components/visa-gold/visa-gold.component';
import { CreditComponent } from './components/credit/credit.component';

let childRoutes: Routes = [
	{ path: 'visa-gold', component: VisaGoldComponent },

];
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'private-clients', component: PrivateClientsComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'mobile-banking', component: MobileBankingComponent },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'cards', component: CardsComponent },
  { path: 'visa-gold', component: VisaGoldComponent },
  { path: 'credit', component: CreditComponent },
];


