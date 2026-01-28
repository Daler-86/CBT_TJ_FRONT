import { Component, HostListener, ElementRef, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FavriComponent } from '../favri/favri.component';
import { CreditService } from '../../api/credit.service';
import { creditData, creditDataSubmit, creditDocument, creditTariff } from '../../models/credit.model';
import { officeList } from '../../models/region.model';
import { RegionService } from '../../api/region.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ScrollToDirective } from '../../directives/scroll-to.directive';

import { CalculatorData } from '../../models/calculate.model';
import { LoanCalculatorComponent } from '../loan-calculator/loan-calculator.component';
import { ModalService } from '../../services/modal.service';
import { ScrollService } from '../../services/scroll.service';
import { CarLoanCalculateComponent } from '../car-loan-calculate/car-loan-calculate.component';
import { Subscription } from 'rxjs';
import { PageTitleService } from '../../services/page-title.service';
import { OnlyDigitsDirective } from '../../shared/directives/only-digits.directive';
@Component({
  selector: 'app-credit-barakat',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    FavriComponent,
    LoanCalculatorComponent,
    ScrollToDirective,
    CarLoanCalculateComponent,
    OnlyDigitsDirective,
  ],
  templateUrl: './credit-barakat.component.html',
  styleUrl: './credit-barakat.component.scss',
})
export class CreditBarakatComponent implements OnInit, OnDestroy {
  imageUrl: string = environment.IMAGE_URL;
  selectedTab = 'credit';
  tariffs: creditTariff[] = [];
  documents: creditDocument[] = [];
  offices: officeList[] = [];
  dropdownOpen = false;
  officeName = '';
  creditId = 0;
  creditData: creditData = {
    id: 0,
    credit_calculator_data: [],
  };
  @ViewChild('customDropdown') dropdownRef!: ElementRef;
  public calculatorDataForChild: CalculatorData[] | null = null;
  private langChangeSubscription: Subscription | undefined;
  model: creditDataSubmit = {
    address: '',
    client_name: '',
    credit_id: this.creditId,
    office_id: 0,
    phone: '',
    purpose: '',
  };

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  private pageTitleService = inject(PageTitleService);
  private translateService = inject(TranslateService);
  private regionService = inject(RegionService);
  private route = inject(ActivatedRoute);
  private creditService = inject(CreditService);
  private notificationService = inject(ModalService);
  private scrollService = inject(ScrollService);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.creditId = +idParam;
    } else {
      console.error('ID is missing in the route parameters.');
    }
    this.updateOfficePlaceholder();

    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.updateOfficePlaceholder();
    });
    this.loadCreditTariff(this.creditId);
    this.loadOffice();
    this.loadCreditDocument(this.creditId);

    this.loadCreditData(this.creditId);

    this.route.queryParams.subscribe((params) => {
      const anchor = params['scrollTo'];
      if (anchor) {
        this.scrollService.scrollToAnchor(anchor);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.dropdownOpen && !this.dropdownRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
  updateOfficePlaceholder(): void {
    if (!this.model.office_id) {
      this.translateService.get('FORMS.PLACEHOLDERS.SELECT_OFFICE').subscribe((translation) => {
        this.officeName = translation;
      });
    }
  }



  submitApplication(form: NgForm) {
    if (form.invalid || !this.model.office_id) {

      const warningMsg = this.translateService.instant('NOTIFICATIONS.FILL_ALL_REQUIRED_FIELDS_WARNING');
      this.notificationService.show(warningMsg, 'error');

      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    this.model.credit_id = this.creditId;

    this.creditService.submitCredit(this.model).subscribe({
      next: () => {
        const successMsg = this.translateService.instant('NOTIFICATIONS.APPLICATION.SUCCESS_MESSAGE');
      this.notificationService.show(successMsg, 'success');
        form.resetForm();

        this.officeName = '';
        this.model = {
          address: '',
          client_name: '',
          credit_id: 0,
          office_id: 0,
          phone: '',
          purpose: '',
        };
        this.updateOfficePlaceholder();
      },
      error: () => {
        const errorMsg = this.translateService.instant('notifications.applicationErrorMessage');
        this.notificationService.show(errorMsg, 'error');

      },
    });
  }
  loadOffice(): void {
    this.regionService.getOfficeList().subscribe(
      (response) => {
        this.offices = response.data.offices;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );
  }

  loadCreditTariff(id: number): void {
    this.creditService.getCreditTariff(id).subscribe(
      (details) => {
        this.tariffs = details.data.credit_tariffs;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      },
    );
  }

  loadCreditDocument(id: number): void {
    this.creditService.getCreditDocument(id).subscribe(
      (details) => {
        this.documents = details.data.credit_documents;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      },
    );
  }

  loadCreditData(id: number): void {
    this.creditService.getCreditData(id).subscribe(
      (details) => {
        this.creditData = details.data.credit_data;
        this.calculatorDataForChild = details.data.credit_data?.credit_calculator_data;
        if (this.creditData && this.creditData.title) {

          this.pageTitleService.setCustomTitle(this.creditData.title);
        }
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      },
    );
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('ru-RU').format(value) + ' с.';
  }

  toggleDropdown(event: Event) {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }


  selectOption(event: Event, item: officeList) {
    this.officeName = item.name;
    this.model.office_id = item.id;
    event.stopPropagation();
    this.dropdownOpen = false;
  }
}
