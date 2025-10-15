import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-autocredit',
  standalone: true,
  imports: [TranslateModule, CommonModule,  FormsModule, FormsModule],
  templateUrl: './autocredit.component.html',
  styleUrl: './autocredit.component.scss'
})
export class AutocreditComponent {
  selectedTab: string = 'credit';
  rangeValues: number[] = [50000, 100000, 150000, 200000, 250000,300000]; // Значения меток
  selectedCurrency: string = 'somoni';
  selectedTerm: string = '1 год';
  interestRate: number = 30; 
  loanTerms: string[] = ['1 год', '2 года', '3 года', '4 года', '5 лет'];
  loanAmount: number = 100000;
  downPayment: number = 50000;

  // Форматирование значения
  formatValue(value: number): string {
    return `${value} с.`;
  }

  // Универсальная функция для обновления фона слайдера
  updateSliderBackground(sliderValue: number, min: number, max: number, cssVariableName: string) {
    const range = max - min;
    const normalizedValue = sliderValue - min;
    const percent = (normalizedValue / range) * 100;
    document.documentElement.style.setProperty(cssVariableName, `${percent}%`);
  }

  ngOnInit() {
    // Инициализация фоновых значений при загрузке
    this.updateSliderBackground(this.loanAmount, 50000, 300000, '--range-percent-auto');
    this.updateSliderBackground(this.downPayment, 20000,200000, '--range-percent-prepayment');
  }

  // Обновление значения и фона для слайдера "Стоимость авто"
  onLoanAmountChange(event: any) {
    this.loanAmount = event.target.value;
    this.updateSliderBackground(this.loanAmount, 50000, 300000, '--range-percent-auto');
  }

  // Обновление значения и фона для слайдера "Предоплата"
  onDownPaymentChange(event: any) {
    this.downPayment = event.target.value;
    this.updateSliderBackground(this.downPayment, 0, 50000, '--range-percent-prepayment');
  }
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


 

  // Форматирование суммы для отображения в поле ввода
  

  // Метод для выбора срока кредита
  selectTerm(term: string) {
    this.selectedTerm = term;
  }
}
