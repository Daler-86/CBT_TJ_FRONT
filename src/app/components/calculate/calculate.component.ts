import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DepositCalculatorComponent } from '../deposit-calculate/deposit-calculate.component';
import { InstallmentCalculateComponent } from '../installment-calculate/installment-calculate.component';
import { CarLoanCalculateComponent } from '../car-loan-calculate/car-loan-calculate.component';
import { LoanCalculatorComponent } from '../loan-calculator/loan-calculator.component';
import { CalculatorData } from '../../models/calculate.model';

@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [
    TranslateModule,
    NgIf,
    FormsModule,
    DepositCalculatorComponent,
    InstallmentCalculateComponent,
    CarLoanCalculateComponent,
    LoanCalculatorComponent,
  ],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss',
})
export class CalculateComponent implements OnInit {
  selectedTab = 'credit';
  loanAmount = 30000;
  loanTerm = 24;
  interestRate = 30;
  loanAmountLabels: string[] = ['10 000с.', '30 000с.', '60 000с.', '80 000с.', '200 000с.'];
  loanTermLabels: string[] = ['12 мес', '24 мес', '36 мес', '48 мес'];
  selectedCurrency = 'Сомони (TJS)';
  depositAmount = 20000;
  depositTerm = 12;
  // interestRate: number = 10;

  currencies: string[] = ['Сомони (TJS)', 'Доллар (USA)', 'Евро (EUR)'];
  depositAmountLabels: string[] = ['10 000с.', '30 000с.', '60 000с.', '80 000с.', '100 000с.'];
  depositTermLabels: string[] = ['3 мес', '6 мес', '9 мес', '12 мес', '24 мес', '36 мес'];

  formattedDepositAmount: string = this.formatCurrency(this.depositAmount);
  formattedDepositTerm: string = this.formatTerm(this.depositTerm);

  formattedLoanAmount: string = this.formatCurrency(this.loanAmount);
  formattedLoanTerm: string = this.formatTerm(this.loanTerm);
  ngOnInit() {
    this.updateSliderBackground('loanAmount');
    this.updateSliderBackground('loanTerm');
  }

  updateFormattedLoanAmount() {
    this.formattedLoanAmount = this.formatCurrency(this.loanAmount);
  }

  public mainPageCalculatorData: CalculatorData[] = [
    {
      currency: 'tjs',
      min_amount: 1000,
      max_amount: 100000,
      min_month: 3,
      max_month: 36,
      min_percentage: 16, // <-- Твоя ставка
      max_percentage: 30, // <-- Твоя ставка
      // Остальные поля можно добавить, если они нужны
      id: 0,
      credit_id: 0,
    },
    {
      currency: 'usd',
      min_amount: 100,
      max_amount: 10000,
      min_month: 3,
      max_month: 36,
      min_percentage: 12, // Для примера, другие ставки для USD
      max_percentage: 22,
      id: 0,
      credit_id: 0,
    },
  ];

  updateFormattedLoanTerm() {
    this.formattedLoanTerm = this.formatTerm(this.loanTerm);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  loanAmountPercent = '';
  loanTermPercent = '';
  depositAmountPercent = '';
  depositTermPercent = '';
  updateSliderBackground(sliderType: string) {
    if (sliderType === 'loanAmount') {
      const percent = ((this.loanAmount - 10000) / (200000 - 10000)) * 100;
      this.loanAmountPercent = `${percent}%`;
    } else if (sliderType === 'loanTerm') {
      const percent = ((this.loanTerm - 12) / (48 - 12)) * 100;
      this.loanTermPercent = `${percent}%`;
    }
  }
  updateDepositSliderBackground(sliderType: string) {
    if (sliderType === 'depositAmount') {
      const percent = ((this.depositAmount - 10000) / (100000 - 10000)) * 100;
      this.depositAmountPercent = `${percent}%`;
    } else if (sliderType === 'depositTerm') {
      const percent = ((this.depositTerm - 3) / (36 - 3)) * 100;
      this.depositTermPercent = `${percent}%`;
    }
  }

  calculateMonthlyPayment(): number {
    const months = this.loanTerm;
    const monthlyInterest = this.interestRate / 100 / 12;
    const payment = (this.loanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));
    return Math.round(payment);
  }
  // Обработка изменения суммы через поле ввода
  onLoanAmountChange(value: string) {
    const rawValue = +value.replace(/\D/g, ''); // Убираем символы, кроме цифр
    if (rawValue >= 10000 && rawValue <= 200000) {
      this.loanAmount = Math.round(rawValue / 50) * 50; // Округляем до ближайшего шага 50
      this.updateFormattedLoanAmount(); // Обновляем форматированную сумму
    }
  }

  applyForLoan() {
    alert('Вы оформили кредит на сумму ' + this.loanAmount + 'с.');
  }

  selectCurrency(currency: string) {
    this.selectedCurrency = currency;
  }

  updateFormattedDepositAmount() {
    this.formattedDepositAmount = this.formatCurrency(this.depositAmount);
  }

  updateFormattedDepositTerm() {
    this.formattedDepositTerm = this.formatTerm(this.depositTerm);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('ru-RU').format(value) + ' с.';
  }

  formatTerm(value: number): string {
    return `${value} мес`;
  }

  calculateDepositIncome(): number {
    return Math.round((this.depositAmount * this.interestRate * this.depositTerm) / 1200);
  }

  calculateFinalAmount(): number {
    return this.depositAmount + this.calculateDepositIncome();
  }

  applyForDeposit() {
    alert('Вы оформили вклад на сумму ' + this.depositAmount + 'с.');
  }
}
