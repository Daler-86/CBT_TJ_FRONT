

import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FavriComponent } from "../favri/favri.component";
import { CreditService } from '../../api/credit.service';
import { creditData, creditDocument, creditList, creditTariff } from '../../models/credit.model';
import { officeList } from '../../models/region.model';
import { RegionService } from '../../api/region.service';
import { ActivatedRoute } from '@angular/router';
import {environment} from "../../../environments/environment";
@Component({
  selector: 'app-credit-barakat',
  standalone: true,
  imports: [TranslateModule, NgFor, NgIf, FormsModule, FavriComponent],
  templateUrl: './credit-barakat.component.html',
  styleUrl: './credit-barakat.component.scss'
})
export class CreditBarakatComponent {
  imageUrl: string = environment.IMAGE_URL;
  selectedTab: string = 'credit';
  loanAmount: number = 30000;
  rangeValues: number[] = [10000, 50000, 100000, 150000, 200000]; // Значения меток
  // cardId: number=0;
  selectedTerm: string = '1 год';
  interestRate: number = 30;
  loanTerms: string[] = ['1 год', '2 года', '3 года', '4 года', '5 лет'];
tariffs:creditTariff[]=[]
documents:creditDocument[]=[]
offices:officeList[]=[]
dropdownOpen:boolean=false
officeName:string='Выберите отделение банка'
creditId: number=0;
creditData:any={}
model: any = {
  address:'',
  client_name: "",
  credit_id: 1,
  office_id: 0,
  phone: "",
  purpose: ""
};
  selectTab(tab: string) {
    this.selectedTab = tab;

  }

  calculateMonthlyPayment(): number {
    const years = parseInt(this.selectedTerm);
    const monthlyInterest = this.interestRate / 100 / 12;
    const numberOfPayments = years * 12;
    const payment = (this.loanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -numberOfPayments));
    return Math.round(payment);
  }

  applyForLoan() {
    alert('Вы оформили кредит на сумму ' + this.loanAmount + 'с.');
  }
  submitApplication() {

    if (this.model.phone && this.model.client_name && this.model.office_id) {

      this.creditService.submitCredit(this.model).subscribe(resp =>{
        console.log(resp);

      },(err =>{
        console.log(err);
      }));
    }

  }
  // loanAmount: number = 30000; // Начальное значение
  formattedLoanAmount: string = this.formatCurrency(this.loanAmount); // Отформатированное значение для отображения в поле ввода
  constructor(
    private regionService:RegionService,
    private route: ActivatedRoute,
    private creditService: CreditService,
  ) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {

      this.creditId= +idParam;  // Преобразование строки в число

    } else {
      console.error('ID is missing in the route parameters.');
      // Здесь может быть код для обработки ситуации отсутствия ID
    }


    this.updateSliderBackground();
    this.loadCreditTariff(this.creditId);
    this.loadOffice()
    this.loadCreditDocument(this.creditId)

this.loadCreditData(this.creditId)
  }

  loadOffice(): void {
    this.regionService.getOfficeList().subscribe(
      (response) => {
        this.offices = response.data.offices;
        console.log(this.offices)
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

  // Обновление форматированной суммы при изменении слайдера
  updateFormattedLoanAmount() {
    this.formattedLoanAmount = this.formatCurrency(this.loanAmount);
    this.updateSliderBackground();
  }

  // Обновление фона слайдера
  updateSliderBackground() {
    const percent = ((this.loanAmount - 10000) / (200000 - 10000)) * 100;
    document.documentElement.style.setProperty('--range-percent', `${percent}%`);
  }

  // Обработка изменения суммы через поле ввода
  onLoanAmountChange(value: string) {
    const rawValue = +value.replace(/\D/g, ''); // Убираем символы, кроме цифр
    if (rawValue >= 10000 && rawValue <= 200000) {
      this.loanAmount = Math.round(rawValue / 50) * 50; // Округляем до ближайшего шага 50
      this.updateFormattedLoanAmount(); // Обновляем форматированную сумму
    }
  }

  // Метод для выбора срока кредита
  selectTerm(term: string) {
    this.selectedTerm = term;
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
