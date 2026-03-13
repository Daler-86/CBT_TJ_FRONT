import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { cardContentItem } from '../../../../models/cards.model';
import { CardsService } from '../../../../api/cards.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-features',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './card-features.component.html',
  styleUrl: './card-features.component.scss',
})
export class CardFeaturesComponent implements OnInit {
  cardId = 0;
  cardContent: cardContentItem[] = [];
  @Input() imageUrl: string = '';
  private cardsService = inject(CardsService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cardId = +idParam;

      this.loadCardDetails(this.cardId);
    }
  }

  get featureClass(): { type1: boolean; type2: boolean } {
    return {
      type1: this.cardContent.length % 3 === 0,
      type2: this.cardContent.length % 2 === 0,
    };
  }

  loadCardDetails(id: number): void {
    this.cardsService.getCardContentItem(id).subscribe(
      (details) => {
        this.cardContent = details.data.card_content_items;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      },
    );
  }
}
