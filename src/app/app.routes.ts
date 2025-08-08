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
import { creditNameResolver } from './services/resolvers/credit-name.resolver';
import { CardWrapperComponent } from './components/cards/card-wrapper/card-wrapper.component';
import { cardNameResolver } from './services/resolvers/card-name.resolver';
import { TransferWrapperComponent } from './components/transfers/transfer-wrapper/transfer-wrapper.component';
import { transferNameResolver } from './services/resolvers/transfer-name.resolver';
import { DepositWrapperComponent } from './components/deposits/deposit-wrapper/deposit-wrapper.component';
import { depositNameResolver } from './services/resolvers/deposit-name.resolver';
import { VacancyWrapperComponent } from './components/vacancies/vacancy-wrapper/vacancy-wrapper.component';
import { vacancyNameResolver } from './services/resolvers/vacancy-name.resolver';
import { VacancyListWrapperComponent } from './components/vacancies/vacancy-list-wrapper/vacancy-list-wrapper.component';
import { NewsWrapperComponent } from './components/news/news-wrapper/news-wrapper.component';
import { newsTitleResolver } from './services/resolvers/news-title.resolver';
import { TenderWrapperComponent } from './components/tender/tender-wrapper/tender-wrapper.component';
import { tenderNameResolver } from './services/resolvers/tender-name.resolver';
import { RkoWrapperComponent } from './components/rko/rko-wrapper/rko-wrapper.component';
import { rkoNameResolver } from './services/resolvers/rko-name.resolver';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' ,data: { titleKey: 'titles.default'  }},
  { path: 'home', component: HomeComponent,
  data: { titleKey: 'titles.default' 
}
},
{
  path: 'cards',
  component: CardWrapperComponent, // Используем обертку
  data: { 
    breadcrumb: 'breadcrumbs.cards', 
    titleKey: 'titles.cards' 
  },
  children: [
    {
      path: '', // Для URL /cards
      component: CardsComponent 
    },
    {
      path: ':id', // Для URL /cards/123
      component: CardDetailsComponent,
      data: { isDynamic: true },
      resolve: { breadcrumb: cardNameResolver }
    }
  ]
},
 {
    path: 'credits',
    component: CreditComponent, // Родительский компонент с <router-outlet>
    // --- 1. Крошка определяется на родительском уровне ---
           data: { breadcrumb: 'breadcrumbs.credits', titleKey: 'titles.credits' },
    children: [
      { 
        path: '', 
        component: CreditOverviewComponent,

         // --- 2. УБИРАЕМ breadcrumb отсюда, чтобы не было дублирования ---
      },
      {
        path: ':id',
        component: CreditBarakatComponent,
        data: { isDynamic: true },
        resolve: { breadcrumb: creditNameResolver }
      }
    ]
  },
  {
    path: 'transfers', // <-- ОБЩИЙ ПУТЬ ДЛЯ РАЗДЕЛА
    component: TransferWrapperComponent,
    data: { 
      breadcrumb: 'breadcrumbs.transfers', 
      titleKey: 'titles.transfers' 
    },
    children: [
      {
        path: '', // <-- Для URL /transfers (список)
        component: TransfersComponent 
      },
      {
        path: ':id', // <-- Для URL /transfers/123 (детали)
        component: TransfersDetailsComponent,
        data: { isDynamic: true },
        resolve: { breadcrumb: transferNameResolver }
      }
    ]
  },
  {
    path: 'deposits', // <-- ОБЩИЙ ПУТЬ ДЛЯ РАЗДЕЛА
    component: DepositWrapperComponent,
    data: { 
      breadcrumb: 'breadcrumbs.deposits', 
      titleKey: 'titles.deposits' 
    },
    children: [
      {
        path: '', // <-- Для URL /deposits (список)
        component: DepositsComponent 
      },
      {
        path: ':id', // <-- Для URL /deposits/123 (детали)
        component: DepositDetailComponent,
        data: { isDynamic: true },
        resolve: { breadcrumb: depositNameResolver }
      }
    ]
  },
  {
    path: 'vacancies',
    component: VacancyWrapperComponent, // <-- Обертка для всего раздела
    data: { 
      breadcrumb: 'breadcrumbs.vacancies' ,
      titleKey: 'titles.vacancies' 
    },
    children: [
      {
        path: '', // <-- URL: /vacancies (Общая страница)
        component: VacanciesComponent,
   
      },
      {
        path: 'list', // <-- URL: /vacancies/list
        component: VacancyListWrapperComponent, // <-- Обертка для списка и деталей
        data: { 
          breadcrumb: 'breadcrumbs.vacancyList',
          titleKey: 'titles.vacancyList' 
        },
        children: [
          {
            path: '', // <-- URL: /vacancies/list (показывает список)
            component: VacancyListComponent
          },
          {
            path: ':id', // <-- URL: /vacancies/list/:id (показывает детали)
            component: VacancyDetailComponent,
            data: { isDynamic: true },
            resolve: { breadcrumb: vacancyNameResolver }
          }
        ]
      }
    ]
  },
  {
    path: 'news', // <-- ОБЩИЙ ПУТЬ ДЛЯ РАЗДЕЛА
    component: NewsWrapperComponent,
    data: { 
      breadcrumb: 'breadcrumbs.news', 
      titleKey: 'titles.news' 
    },
    children: [
      {
        path: '', // <-- Для URL /news (список)
        component: NewsComponent 
      },
      {
        path: ':id', // <-- Для URL /news/123 (детали)
        component: NewsDetailComponent,
        data: { isDynamic: true },
        resolve: { breadcrumb: newsTitleResolver }
      }
    ]
  },
  {
    path: 'tender', // <-- Новый общий путь
    component: TenderWrapperComponent,
    data: { breadcrumb: 'breadcrumbs.tenders', titleKey: 'titles.tenders' },
    children: [
      { path: '', component: TenderComponent }, // <-- Список
      {
        path: ':id', // <-- Детали
        component: TenderDetailsComponent,
        data: { isDynamic: true },
        resolve: { breadcrumb: tenderNameResolver }
      }
    ]
  },
  {
    path: 'rko',
    component: RkoWrapperComponent,
    data: { breadcrumb: 'breadcrumbs.rko', titleKey: 'titles.rko' },
    children: [
      { path: '', component: RkoComponent }, // <-- Список
      {
        path: ':id', // <-- Детали
        component: RkoDetailsComponent,
        data: { isDynamic: true },
        resolve: { breadcrumb: rkoNameResolver }
      }
    ]
  },

   { path: 'map', component: MapComponent, data: { breadcrumb: 'breadcrumbs.map', titleKey: 'titles.map' } },
   { path: 'about-us', component: AboutUsComponent, data: { breadcrumb: 'breadcrumbs.aboutUs', titleKey: 'titles.aboutUs' } },
   { path: 'report', component: ReportComponent, data: { breadcrumb: 'breadcrumbs.report', titleKey: 'titles.report' } },
   { path: 'bank-detail', component: BankDetailComponent, data: { breadcrumb: 'breadcrumbs.bankDetail', titleKey: 'titles.bankDetail' } },
   { path: 'merchant', component: MerchantComponent, data: { breadcrumb: 'breadcrumbs.merchant', titleKey: 'titles.merchant' } },
   { path: 'contact', component: ContactComponent, data: { breadcrumb: 'breadcrumbs.contact', titleKey: 'titles.contact' } },
   { path: 'insurance-info', component: InsuranceInfoComponent, data: { breadcrumb: 'breadcrumbs.insurance', titleKey: 'titles.insurance' } },
   { path: 'salary-project', component: SalaryProjectPageComponent, data: { breadcrumb: 'breadcrumbs.salaryProject', titleKey: 'titles.salaryProject' } },
   { path: 'acquiring', component: AcquiringPageComponent, data: { breadcrumb: 'breadcrumbs.acquiring', titleKey: 'titles.acquiring' } },
];

 


