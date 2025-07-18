// src/app/pages/deposit-detail/deposit-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from "../../../environments/environment";

// Твои сервисы и модели
// import { DepositsService } from '../../api/deposits.service';
import { RegionService } from '../../api/region.service';
// import { NotificationService } from '../../services/notification.service';
import { depositDetail } from '../../models/deposit.model';
import { officeList } from '../../models/region.model';
import { DepositCalculatorComponent } from '../deposit-calculate/deposit-calculate.component';
import { DepositsService } from '../../api/deposit.service';
import { ModalService } from '../../services/modal.service';
import { ScrollToDirective } from '../../directives/scroll-to.directive';

// Импортируем компонент калькулятора, чтобы страница знала о нем
// import { DepositCalculatorComponent } from '../../components/deposit-calculator/deposit-calculator.component';

@Component({
  selector: 'app-deposit-detail',
  standalone: true,
  // Добавляем наш калькулятор и FormsModule
  imports: [CommonModule, FormsModule, TranslateModule, DepositCalculatorComponent, ScrollToDirective,],
  templateUrl: './deposit-detail.component.html',
  styleUrls: ['./deposit-detail.component.scss']
})
export class DepositDetailComponent implements OnInit {
  // --- Свойства для отображения данных о продукте ---
  imageUrl: string = environment.IMAGE_URL;
  depositId: number = 0;
  depositData: depositDetail | null = null;
  selectedFaqIndex: number | null = null;
  selectedTab: string = '';

  // --- Свойства для формы заявки ---
  offices: officeList[] = [];
  dropdownOpen: boolean = false;
  officeName: string = 'Выберите отделение банка';
  
  // Модель только для полей формы
  model = {
    client_name: '',
    phone: '',
    office_id: null as number | null
  };

  constructor(
    private route: ActivatedRoute,
    private depositService: DepositsService,
    private regionService: RegionService,
    private notificationService: ModalService,
    private translateService: TranslateService // Если он используется
  ) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.depositId = +idParam;
      this.loadDepositData(this.depositId);
      this.loadOffice();
    }
  }

  loadDepositData(id: number): void {
    this.depositService.getDepositData(id).subscribe({
      next: (response) => {
        this.depositData = response.data;
        // Устанавливаем первый таб по умолчанию
        if (this.depositData?.currency) {
          this.selectedTab = this.depositData.currency[0].code;
        }
      },
      error: (error) => console.error('Ошибка при запросе данных', error)
    });
  }

  loadOffice(): void {
    this.regionService.getOfficeList().subscribe({
      next: (response) => {
        this.offices = response.data.offices;
      },
      error: (error) => console.error('Ошибка при запросе данных', error)
    });
  }
  
  // Метод для отправки формы
  submitApplication(form: NgForm): void {
    if (form.invalid || !this.model.office_id) {
      this.notificationService.show('Пожалуйста, заполните все обязательные поля.', 'error');
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const dataToSend = {
      deposit_id: this.depositId,
      ...this.model
    };

    // console.log('Отправка заявки на вклад:', dataToSend);

    this.depositService.submitDeposit(dataToSend).subscribe({
      next: (resp) => {
        this.notificationService.show('Ваша заявка успешно принята!', 'success');
        form.reset();
        this.model.office_id = null;
        this.officeName = 'Выберите отделение банка';
      },
      error: (err) => {
        this.notificationService.show('Не удалось отправить заявку. Попробуйте позже.', 'error');
      }
    });
  }

  // --- Вспомогательные методы для UI ---
  
  selectTab(tabCode: string): void {
    this.selectedTab = tabCode;
  }
  
  toggleFaq(index: number): void {
    this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
  }

  toggleDropdown(event: Event): void {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }

  selectOption(item: officeList): void {
    this.officeName = item.name;
    this.model.office_id = item.id;
    this.dropdownOpen = false;
  }
}