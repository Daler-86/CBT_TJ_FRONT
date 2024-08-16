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

  selectTerm(term: string) {
    this.selectedTerm = term;
   
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
}

