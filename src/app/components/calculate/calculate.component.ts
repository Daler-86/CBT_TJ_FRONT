import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [TranslateModule, NgFor, NgIf, FormsModule],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss'
})


export class CalculateComponent {
  selectedTab: string = 'credit';
  loanAmount: number = 30000;
  rangeValues: number[] = [10000, 50000, 100000, 150000, 200000]; // Значения меток

  selectedTerm: string = '1 год';
  interestRate: number = 30; 
  loanTerms: string[] = ['1 год', '2 года', '3 года', '4 года', '5 лет'];

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

  // loanAmount: number = 30000; // Начальное значение
  formattedLoanAmount: string = this.formatCurrency(this.loanAmount); // Отформатированное значение для отображения в поле ввода
 
  ngOnInit() {
    this.updateSliderBackground();
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
}

