import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { bankDetails, currency } from '../../models/bank-detail.model';
import { CommonModule } from '@angular/common';
import { BankDetailsService } from '../../api/bank-details.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-bank-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss'],
})
export class BankDetailComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  bankdetailList: bankDetails[] = [];
  bankdetailCurrency: currency[] = [];

  selectedTabId: number | null = null;
  private bankDetailService = inject(BankDetailsService);

  ngOnInit(): void {
 this.loadCurrency();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadBankDetails(tabId: number) {
    const sub = this.bankDetailService.getBankDetails(tabId).subscribe({
      next: (response) => {
        this.bankdetailList = response.data.bank_details;
      },
      error: (error) => {
        console.error(`Ошибка при загрузке реквизитов для таба ${tabId}`, error);
      },
    });
    this.subscriptions.add(sub);
  }

  loadCurrency() {
    const sub = this.bankDetailService.getBankDetailCurrency().subscribe({
      next: (response) => {
        this.bankdetailCurrency = response.data.bank_detail_currencies;

        if (this.bankdetailCurrency && this.bankdetailCurrency.length > 0) {
          const defaultTabId = this.bankdetailCurrency[0].id;

          this.selectTab(defaultTabId, true); 
        }
      },
      error: (error) => {
        console.error('Ошибка при загрузке валют', error);
      },
    });
    this.subscriptions.add(sub);
  }

  selectTab(tabId: number, isInitialLoad = false) {
     if (!isInitialLoad && this.selectedTabId === tabId) {
      return;
    }

    this.selectedTabId = tabId;
    this.loadBankDetails(tabId);
  }

  isTabSelected(tabId: number): boolean {
    return this.selectedTabId === tabId;
  }

  trackByCurrencyId(index: number, item: currency): number {
    return item.id;
  }

  trackByDetailId(index: number, item: bankDetails): string | number {
    return item.id || index;
  }
}
