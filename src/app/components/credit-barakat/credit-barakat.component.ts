

import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FavriComponent } from "../favri/favri.component";
import { CreditService } from '../../api/credit.service';
import { creditData, creditDocument, creditList, creditTariff } from '../../models/credit.model';
import { officeList } from '../../models/region.model';
import { RegionService } from '../../api/region.service';
import { ActivatedRoute } from '@angular/router';
import {environment} from "../../../environments/environment";
import { ScrollToDirective } from '../../directives/scroll-to.directive';

import { CalculatorData } from '../../models/calculate.model';
import { LoanCalculatorComponent } from "../loan-calculator/loan-calculator.component";
import { ModalService } from '../../services/modal.service';
import { ScrollService } from '../../services/scroll.service';
import { CarLoanCalculateComponent } from "../car-loan-calculate/car-loan-calculate.component";
@Component({
  selector: 'app-credit-barakat',
  standalone: true,
  imports: [TranslateModule, NgFor, NgIf, FormsModule, FavriComponent, LoanCalculatorComponent, ScrollToDirective, CarLoanCalculateComponent],
  templateUrl: './credit-barakat.component.html',
  styleUrl: './credit-barakat.component.scss'
})
export class CreditBarakatComponent {
  
  imageUrl: string = environment.IMAGE_URL;
  selectedTab: string = 'credit';
tariffs:creditTariff[]=[]
documents:creditDocument[]=[]
offices:officeList[]=[]
dropdownOpen:boolean=false
officeName:string=''
creditId: number=0;
creditData:any={}

public calculatorDataForChild: CalculatorData[] | null = null;

model: any = {
  address:'',
  client_name: "",
  credit_id: this.creditId,
  office_id: 0,
  phone: "",
  purpose: ""
};

  selectTab(tab: string) {
    this.selectedTab = tab;

  }



  submitApplication(form: NgForm) { // 2. Принимаем форму как аргумент
    // 3. Проверяем валидность через form.invalid
    if (form.invalid || !this.model.office_id) {
      this.notificationService.show('Пожалуйста, заполните все обязательные поля.', 'error');
      // Помечаем все контролы как "тронутые", чтобы показать все ошибки
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    
    // Добавляем ID кредита в модель перед отправкой
    this.model.credit_id = this.creditId;

    this.creditService.submitCredit(this.model).subscribe({
      next: (resp) => {
        this.notificationService.show('Ваша заявка успешно принята!', 'success');
        
        // === 4. ПРАВИЛЬНЫЙ СПОСОБ ОЧИСТКИ ФОРМЫ ===
        // Метод resetForm() сбрасывает и значения, и состояние валидации (touched, dirty и т.д.)
        form.resetForm();
        
        // Сбрасываем дополнительные переменные, не связанные с формой
        this.officeName = '';
        // Инициализируем модель заново, если нужно
        this.model = {
          address: '',
          client_name: "",
          credit_id: 0,
          office_id: 0,
          phone: "",
          purpose: ""
        };
      },
      error: (err) => {
        this.notificationService.show('Не удалось отправить заявку.', 'error');
      }
    });
  }
  // submitApplication() {

  //   if (this.model.phone && this.model.client_name && this.model.office_id) {

  //     this.creditService.submitCredit(this.model).subscribe(resp =>{
       
  //       this.notificationService.show('Ваша заявка успешно принята!', 'success');
  //       this.model = {
  //         address: '',
  //         client_name: "",
  //         credit_id: this.creditId, // Сохраняем ID кредита, если нужно
  //         office_id: 0,
  //         phone: "",
  //         purpose: ""
  //       };

  //     },(err =>{
  //       this.notificationService.show('Не удалось отправить заявку.', 'error');
  //     }));
  //   } else {
  //     // Можно добавить сообщение для пользователя, что нужно заполнить все поля
  //     this.notificationService.show('Пожалуйста, заполните все обязательные поля.','error');
  //   }

  // }
  // loanAmount: number = 30000; // Начальное значение
  // formattedLoanAmount: string = this.formatCurrency(this.loanAmount); // Отформатированное значение для отображения в поле ввода
  constructor(
  
    private translateService: TranslateService,
    private regionService:RegionService,
    private route: ActivatedRoute,
    private creditService: CreditService,
    private notificationService: ModalService,
    private scrollService: ScrollService,
  ) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {

      this.creditId= +idParam;  // Преобразование строки в число

    } else {
      console.error('ID is missing in the route parameters.');
      // Здесь может быть код для обработки ситуации отсутствия ID
    }

    this.translateService.get('forms.placeholders.selectOffice').subscribe(translation => {
      // Когда перевод будет готов, присваиваем его нашей переменной
      this.officeName = translation;
    });
   this.translateService.get('forms.placeholders.selectOffice').subscribe(translation => {
      // Когда перевод будет готов, присваиваем его нашей переменной
      this.officeName = translation;
    });
    this.loadCreditTariff(this.creditId);
    this.loadOffice()
    this.loadCreditDocument(this.creditId)

this.loadCreditData(this.creditId)

this.route.queryParams.subscribe(params => {
  const anchor = params['scrollTo']; // Ищем параметр 'scrollTo' в URL
  if (anchor) {
    // Если параметр есть, вызываем наш сервис
    this.scrollService.scrollToAnchor(anchor);
  }
});
  }

  loadOffice(): void {
    this.regionService.getOfficeList().subscribe(
      (response) => {
        this.offices = response.data.offices;
        // console.log(this.offices)
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }

  loadCreditTariff(id: number): void {
    this.creditService.getCreditTariff(id).subscribe(
      (details) => {
        this.tariffs=details.data.credit_tariffs
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
  }

  loadCreditDocument(id: number): void {
    this.creditService.getCreditDocument(id).subscribe(
      (details) => {
        this.documents=details.data.credit_documents
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
  }

  loadCreditData(id: number): void {
    this.creditService.getCreditData(id).subscribe(
      (details) => {
        this.creditData=details.data.credit_data
        this.calculatorDataForChild = details.data.credit_data.credit_calculator_data;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
  }
  // Форматирование суммы для отображения в поле ввода
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('ru-RU').format(value) + ' с.';
  }



 



  toggleDropdown(event: Event) {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation(); // Останавливаем распространение события
  }
  // @HostListener('document:click', ['$event'])

  selectOption( event: Event,item:officeList) {
    this.officeName = item.name; // Обновляем имя для отображения
    this.model.office_id = item.id;
    event.stopPropagation();
    this.dropdownOpen = false;

  }
}
