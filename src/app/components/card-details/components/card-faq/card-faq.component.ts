import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { cardFaqs } from '../../../../models/cards.model';
import { ActivatedRoute } from '@angular/router';
import { CardsService } from '../../../../api/cards.service';

@Component({
  selector: 'app-card-faq',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './card-faq.component.html',
  styleUrl: './card-faq.component.scss'
})
export class CardFaqComponent implements OnInit {
  faqs: cardFaqs[] = [];
  cardId = 0;
  selectedFaqIndex: number | null = null;
  private cardsService = inject(CardsService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cardId = +idParam;
      // Загружаем все данные для страницы
      this.loadCardFaqs(this.cardId);
  }
}

  toggleFaq(index: number): void {
    this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
  }

  
  loadCardFaqs(id: number): void {
    this.cardsService.getCardFaqs(id).subscribe(
      (details) => {
        this.faqs = details.data.card_faqs;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      },
    );
  }

}
