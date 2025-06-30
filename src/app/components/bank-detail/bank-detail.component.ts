import { Component, OnInit, OnDestroy } from '@angular/core';
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
  styleUrls: ['./bank-detail.component.scss']
})
export class BankDetailComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  bankdetailList: bankDetails[] = [];
  bankdetailCurrency: currency[] = [];
  
  // Инициализируем как null. Это покажет, что выбор еще не сделан.
  selectedTabId: number | null = null; 

  constructor(private bankDetailService: BankDetailsService) { }

  ngOnInit(): void {
    // Просто запускаем загрузку валют. Все остальное произойдет после ее завершения.
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
      }
    });
    this.subscriptions.add(sub);
  }

  loadCurrency() {
    const sub = this.bankDetailService.getBankDetailCurrency().subscribe({
      next: (response) => {
        this.bankdetailCurrency = response.data.bank_detail_currencies;
        
        // --- НОВАЯ ЛОГИКА ---
        // Проверяем, что список валют не пустой
        if (this.bankdetailCurrency && this.bankdetailCurrency.length > 0) {
          // Берем ID ПЕРВОГО элемента из полученного списка
          const defaultTabId = this.bankdetailCurrency[0].id;
          // Устанавливаем его как активный таб
          this.selectTab(defaultTabId, true); // `true` как флаг, что это первая загрузка
        }
        // --- КОНЕЦ НОВОЙ ЛОГИКИ ---
      },
      error: (error) => {
        console.error('Ошибка при загрузке валют', error);
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Выбирает таб и загружает для него данные.
   * @param tabId - ID выбранного таба.
   * @param isInitialLoad - Флаг, чтобы не переустанавливать selectedTabId, если он уже установлен.
   */
  selectTab(tabId: number, isInitialLoad: boolean = false) {
    // Если это не первая загрузка, или если таб уже выбран, ничего не делаем.
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