import { Routes } from '@angular/router';
import { VacanciesComponent } from './components/vacancies/vacancies.component';
import { HomeComponent } from './components/home/home.component';
import { CardsComponent } from './components/cards/cards.component';

import { CreditComponent } from './components/credit/credit.component';

import { VacancyListComponent } from './components/vacancy-list/vacancy-list.component';
import { VacancyDetailComponent } from './components/vacancy-detail/vacancy-detail.component';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { CreditBarakatComponent } from './components/credit-barakat/credit-barakat.component';
import { CreditOverviewComponent } from './components/credit-overview/credit-overview.component';
import { AutocreditComponent } from './components/autocredit/autocredit.component';
import { MapComponent } from './components/map/map.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { TransfersComponent } from './components/transfers/transfers.component';
import { DepositsComponent } from './components/deposits/deposits.component';
import { TransfersDetailsComponent } from './components/transfers-details/transfers-details.component';
import { DepositDetailComponent } from './components/deposit-detail/deposit-detail.component';
import { TenderComponent } from './components/tender/tender.component';
import { TenderDetailsComponent } from './components/tender-details/tender-details.component';
import { ReportComponent } from './components/report/report.component';
import { BankDetailComponent } from './components/bank-detail/bank-detail.component';
import { NewsComponent } from './components/news/news.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { RkoComponent } from './components/rko/rko.component';
import { RkoDetailsComponent } from './components/rko-details/rko-details.component';
import { MerchantComponent } from './components/merchant/merchant.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { breadcrumb: 'Главная' } },
  { path: 'vacancies', component: VacanciesComponent, data: { breadcrumb: 'Вакансии' } },
  { path: 'cards', component: CardsComponent, data: { breadcrumb: 'Карты' } }, 
   { path: 'transfers', component: TransfersComponent, data: { breadcrumb: 'Переводы' } },
  { path: 'deposits', component: DepositsComponent, data: { breadcrumb: 'Вклады' } },
  { path: 'vacancy-list', component: VacancyListComponent, data: { breadcrumb: 'Список вакансий' } },
  { path: 'vacancy-list/:id', component: VacancyDetailComponent, data: { breadcrumb: 'Детали вакансии' } },
  { path: 'card-details/:id', component: CardDetailsComponent, data: { breadcrumb: 'Детали карты' } },
  {
    path: 'credits',
    component: CreditComponent, 
    children: [
      {
        path: '',
        component: CreditOverviewComponent, 
        data: { breadcrumb: 'Кредит' },
        
      },
      {
        path: 'credit-auto',
        component: AutocreditComponent, 
        data: { breadcrumb: 'Автокредит ' }
      }, 
        {
        path: ':id', // Параметр пути для детального просмотра
        component: CreditBarakatComponent, // Укажите здесь компонент для детального просмотра
        data: { breadcrumb: 'Детали кредита' }
      }
    ]
  },
  { path: 'map', component: MapComponent, data: { breadcrumb: 'Карта' } },
  { path: 'transfers-details/:id', component: TransfersDetailsComponent, data: { breadcrumb: 'Детали карты' } },
  { path: 'deposit-details/:id', component: DepositDetailComponent, data: { breadcrumb: 'Детали карты' } },
   {path:'about-us',component:AboutUsComponent},
   {path:'tender',component:TenderComponent},
   { path: 'tender-detail/:id', component: TenderDetailsComponent, data: { breadcrumb: 'Детали карты' } },
   {path:'report',component:ReportComponent},
   {path:'bank-detail',component:BankDetailComponent},
   {path:'news', component:NewsComponent},
   {path:'news-detail/:id', component:NewsDetailComponent},
   { path: 'scss', component: RkoComponent },
   { path: 'scs-details/:id', component: RkoDetailsComponent },
   { path: 'merchant', component: MerchantComponent },
   { path: 'contact', component: ContactComponent },
];

 


