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


// export class CalculateComponent {
//   selectedTab: string = 'credit';
//   loanAmount: number = 30000;
//   rangeValues: number[] = [10000, 50000, 100000, 150000, 200000]; // Значения меток

//   selectedTerm: string = '1 год';
//   interestRate: number = 30; 
//   loanTerms: string[] = ['1 год', '2 года', '3 года', '4 года', '5 лет'];

//   selectTab(tab: string) {
//     this.selectedTab = tab;
   
//   }

//   calculateMonthlyPayment(): number {
//     const years = parseInt(this.selectedTerm);
//     const monthlyInterest = this.interestRate / 100 / 12;
//     const numberOfPayments = years * 12;
//     const payment = (this.loanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -numberOfPayments));
//     return Math.round(payment);
//   }

//   applyForLoan() {
//     alert('Вы оформили кредит на сумму ' + this.loanAmount + 'с.');
//   }

//   // loanAmount: number = 30000; // Начальное значение
//   formattedLoanAmount: string = this.formatCurrency(this.loanAmount); // Отформатированное значение для отображения в поле ввода
 
//   ngOnInit() {
//     this.updateSliderBackground();
//   }

//   // Форматирование суммы для отображения в поле ввода
//   formatCurrency(value: number): string {
//     return new Intl.NumberFormat('ru-RU').format(value) + ' с.';
//   }

//   // Обновление форматированной суммы при изменении слайдера
//   updateFormattedLoanAmount() {
//     this.formattedLoanAmount = this.formatCurrency(this.loanAmount);
//     this.updateSliderBackground();
//   }

//   // Обновление фона слайдера
//   updateSliderBackground() {
//     const percent = ((this.loanAmount - 10000) / (200000 - 10000)) * 100;
//     document.documentElement.style.setProperty('--range-percent', `${percent}%`);
//   }

//   // Обработка изменения суммы через поле ввода
//   onLoanAmountChange(value: string) {
//     const rawValue = +value.replace(/\D/g, ''); // Убираем символы, кроме цифр
//     if (rawValue >= 10000 && rawValue <= 200000) {
//       this.loanAmount = Math.round(rawValue / 50) * 50; // Округляем до ближайшего шага 50
//       this.updateFormattedLoanAmount(); // Обновляем форматированную сумму
//     }
//   }

//   // Метод для выбора срока кредита
//   selectTerm(term: string) {
//     this.selectedTerm = term;
//   }
// }
export class CalculateComponent {
  selectedTab: string = 'credit';
  loanAmount: number = 30000;
  loanTerm: number = 24;
  interestRate: number = 30;
  loanAmountLabels: string[] = ['10 000с.', '30 000с.', '60 000с.', '80 000с.', '200 000с.'];
  loanTermLabels: string[] = ['12 мес', '24 мес', '36 мес', '48 мес'];
  selectedCurrency: string = 'Сомони (TJS)';
  depositAmount: number = 20000;
  depositTerm: number = 12;
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
  

  updateFormattedLoanTerm() {
      this.formattedLoanTerm = this.formatTerm(this.loanTerm);
    
    }

  selectTab(tab: string) {
    this.selectedTab = tab;
   
  }
  loanAmountPercent: string = '';
  loanTermPercent: string = '';
  depositAmountPercent: string = '';
  depositTermPercent: string = '';
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
onDepositAmountChange(value:any){
  
}

}

