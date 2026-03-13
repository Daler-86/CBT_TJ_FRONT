import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { cardDetail } from '../../../../models/cards.model';
import { CardsService } from '../../../../api/cards.service';
import { PageTitleService } from '../../../../services/page-title.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-promo',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './card-promo.component.html',
  styleUrl: './card-promo.component.scss',
})
export class CardPromoComponent implements OnInit {
  cardId = 0;
  cardData: cardDetail = {
    id: 0,
  };

  @Input() imageUrl: string = '';

  private route = inject(ActivatedRoute);
  private cardsService = inject(CardsService);
  private pageTitleService = inject(PageTitleService);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cardId = +idParam;
      this.loadCards(this.cardId);
    }
  }

  loadCards(id: number): void {
    this.cardsService.getCardData(id).subscribe(
      (response) => {
        this.cardData = response.data.card_data;
        if (this.cardData && this.cardData.title) {
          this.pageTitleService.setCustomTitle(this.cardData.title);
        }
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );
  }

  scrollToForm(): void {
    const element = document.getElementById('application-form');
    if (!element) return;

    const headerHeight = document.querySelector('.header')?.clientHeight || 0;

    const offsetTop = element.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  }
}
