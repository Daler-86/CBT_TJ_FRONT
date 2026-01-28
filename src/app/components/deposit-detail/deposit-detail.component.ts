import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { depositDetail } from '../../models/deposit.model';
import { DepositCalculatorComponent } from '../deposit-calculate/deposit-calculate.component';
import { DepositsService } from '../../api/deposit.service';
import { ModalService } from '../../services/modal.service';
import { ScrollToDirective } from '../../directives/scroll-to.directive';
import { PageTitleService } from '../../services/page-title.service';
import { OnlyDigitsDirective } from '../../shared/directives/only-digits.directive';

@Component({
  selector: 'app-deposit-detail',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    DepositCalculatorComponent,
    ScrollToDirective,
    OnlyDigitsDirective,
  ],
  templateUrl: './deposit-detail.component.html',
  styleUrls: ['./deposit-detail.component.scss'],
})
export class DepositDetailComponent implements OnInit {
  imageUrl: string = environment.IMAGE_URL;
  depositId = 0;
  depositData: depositDetail | null = null;
  selectedFaqIndex: number | null = null;
  selectedTab = '';

  model = {
    client_name: '',
    phone: '',
  };
  private pageTitleService = inject(PageTitleService);
  private route = inject(ActivatedRoute);
  private depositService = inject(DepositsService);

  private notificationService = inject(ModalService);
  private translateService = inject(TranslateService);

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.depositId = +idParam;
      this.loadDepositData(this.depositId);
    }
  }

  loadDepositData(id: number): void {
    this.depositService.getDepositData(id).subscribe({
      next: (response) => {
        this.depositData = response.data;
        if (this.depositData?.currency) {
          this.selectedTab = this.depositData.currency[0].code;
        }
        if (this.depositData && this.depositData.title) {
          this.pageTitleService.setCustomTitle(this.depositData.title);
        }
      },
      error: (error) => console.error('Ошибка при запросе данных', error),
    });
  }

  submitApplication(form: NgForm): void {
    if (form.invalid) {
      const message = this.translateService.instant('NOTIFICATIONS.FILL_ALL_REQUIRED_FIELDS_WARNING');
      this.notificationService.show(message, 'error');

      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    const dataToSend = {
      deposit_id: this.depositId,
      ...this.model,
    };

    this.depositService.submitDeposit(dataToSend).subscribe({
      next: () => {
        const successMessage = this.translateService.instant('NOTIFICATIONS.APPLICATION_SENT_SUCCESS');
        this.notificationService.show(successMessage, 'success');

        form.reset();
      },
      error: () => {
        const errorMessage = this.translateService.instant('NOTIFICATIONS.APPLICATION_ERROR_MESSAGE');
        this.notificationService.show(errorMessage, 'error');
      },
    });
  }

  selectTab(tabCode: string): void {
    this.selectedTab = tabCode;
  }

  toggleFaq(index: number): void {
    this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
  }
}
