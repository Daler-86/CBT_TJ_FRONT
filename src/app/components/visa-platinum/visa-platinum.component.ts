import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-visa-platinum',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './visa-platinum.component.html',
  styleUrl: './visa-platinum.component.scss'
})

export class VisaPlatinumComponent {
  selectedTab: string = 'services';
  selectTab(tab: string) {
    this.selectedTab = tab;
   
  }

  selectedFaqIndex: number | null = null;

  faqs = [
    {
      question: 'Можно ли оплачивать картой Visa в интернете?',
      answer: 'Для того чтобы оплачивать картой Visa, нужно ...'
    },
    {
      question: 'Как пополнить свою карту?',
      answer: 'Пополнить свою карту можно ...'
    },
    {
      question: 'Есть ли лимиты на пополнение карты?',
      answer: 'Да есть лимиты ...'
    },
    {
      question: 'Где я могу использовать свою карту Visa Gold?',
      answer: 'Вы можете использовать свою карту ...'
    },
    {
      question: 'Могу ли я использовать карту Visa за границей?',
      answer: 'Да, вы можете использовать ...'
    },

  ];

  toggleFaq(index: number) {
    this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
  }

  model: any = {};

  onSubmit() {
    if (this.model.phone && this.model.name && this.model.branch) {
      // Здесь можно обработать отправку формы
      console.log('Форма отправлена:', this.model);
    }
  }
}
