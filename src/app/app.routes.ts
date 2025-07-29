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
import { InsuranceInfoComponent } from './components/insurance-info/insurance-info.component';
import { SalaryProjectPageComponent } from './components/salary-project-page/salary-project-page.component';
import { AcquiringPageComponent } from './components/acquiring-page/acquiring-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'cards', component: CardsComponent }, 
   { path: 'transfers', component: TransfersComponent },
  { path: 'deposits', component: DepositsComponent },
  { path: 'vacancy-list', component: VacancyListComponent},
  { path: 'vacancy-list/:id', component: VacancyDetailComponent },
  { path: 'card-details/:id', component: CardDetailsComponent },
  {
    path: 'credits',
    component: CreditComponent, 
    children: [
      {
        path: '',
        component: CreditOverviewComponent, 
    
        
      },
      {
        path: 'credit-auto',
        component: AutocreditComponent, 
    
      }, 
        {
        path: ':id', // Параметр пути для детального просмотра
        component: CreditBarakatComponent, // Укажите здесь компонент для детального просмотра
   
      }
    ]
  },
  { path: 'map', component: MapComponent },
  { path: 'transfers-details/:id', component: TransfersDetailsComponent },
  { path: 'deposit-details/:id', component: DepositDetailComponent},
   {path:'about-us',component:AboutUsComponent},
   {path:'tender',component:TenderComponent},
   { path: 'tender-detail/:id', component: TenderDetailsComponent },
   {path:'report',component:ReportComponent},
   {path:'bank-detail',component:BankDetailComponent},
   {path:'news', component:NewsComponent},
   {path:'news-detail/:id', component:NewsDetailComponent},
   { path: 'scss', component: RkoComponent },
   { path: 'scs-details/:id', component: RkoDetailsComponent },
   { path: 'merchant', component: MerchantComponent },
   { path: 'contact', component: ContactComponent },
   {path:"insurance-info", component:InsuranceInfoComponent},
   {path:"salary-project", component:SalaryProjectPageComponent},
   {
    path:"acquiring", component:AcquiringPageComponent
   }
];

 


