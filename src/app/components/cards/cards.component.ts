import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, NgIf, NgFor],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})

export class CardsComponent {
  selectedTab: string = 'all';
  selectTab(tab: string) {
    this.selectedTab = tab;
   
  }

  selectedFaqIndex: number | null = null;

  faqs = [
    {
      question: 'Как заказать карту Visa от Коммерцбанка?',
      answer: 'Для того чтобы заказать карту Visa, нужно ...'
    },
    {
      question: 'Какой срок действия у карт?',
      answer: 'Срок действия карт составляет ...'
    },
    {
      question: 'Где можно скачать реквизиты Visa?',
      answer: 'Реквизиты можно скачать на ...'
    },
    {
      question: 'Как мне установить или изменить ПИН-код карты?',
      answer: 'Для установки или изменения ПИН-кода ...'
    }
  ];

  toggleFaq(index: number) {
    this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
  }
}
