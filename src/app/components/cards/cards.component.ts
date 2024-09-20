import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardsService } from '../../api/cards.service';
import { Card, CardBrand } from '../../models/cards.model'; 
@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, NgIf, NgFor],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})

export class CardsComponent {

  cardList: any[] = [];
  cardBrands:any[]=[]
  contentItem:any[]=[]
  constructor(private cardsService: CardsService) {}

  ngOnInit(): void {
    this.cardsService.getCardList().subscribe(
      (response) => {
        this.cardList = response.data.cards;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );

    this.cardsService.getCardBrands().subscribe(
      (response) => {
        this.cardBrands = response.data.card_brands;
        console.log(response)
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }
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
  onCardClick(cardId: number) {
    this.cardsService.getCardContentItem(cardId).subscribe(
      (details) => {
        this.contentItem=details.data.card_content_items
        console.log(details);
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
  }
}
