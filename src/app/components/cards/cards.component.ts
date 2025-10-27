import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardsService } from '../../api/cards.service';

import { MenuService } from '../../api/menu.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Card, CardBrand, cardContentItem } from '../../models/cards.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, NgClass],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
})
export class CardsComponent implements OnInit {
  imageUrl: string = environment.IMAGE_URL;
  cardList: Card[] = [];
  cardBrands: CardBrand[] = [];
  contentItem: cardContentItem[] = [];
  personTypeId = 1;
  selectedBrandId = new BehaviorSubject<number>(1);
  selectedBrandId$ = this.selectedBrandId.asObservable();
  currentBrandId: number | null = null;
  selectedTab = 'all';
  private cardsService = inject(CardsService);
  private menuService = inject(MenuService);
  private router = inject(Router);

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.menuService.currentPersonTypeId.subscribe((id) => {
      this.personTypeId = id;
      this.loadAllCards(); // Загрузка всех карт по умолчанию
    });

    this.loadCardBrands();
  }

  loadCards() {
    this.cardsService.getCardList(this.personTypeId, this.selectedBrandId.getValue()).subscribe(
      (response) => {
        this.cardList = response.data.cards;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );
  }
  loadCardBrands() {
    this.cardsService.getCardBrands().subscribe(
      (response) => {
        this.cardBrands = response.data.card_brands;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );
  }
  isBrandSelected(brandId: number): boolean {
    return this.selectedTab !== 'all' && this.currentBrandId === brandId;
  }
  selectBrand(brandId: number) {
    this.selectedBrandId.next(brandId);
    this.currentBrandId = brandId;
  }
  navigateToCardDetailsAndForm(cardId: number): void {
    this.router.navigate(['/card-details', cardId], { queryParams: { scrollToForm: true } });
  }
  loadAllCards() {
    this.cardsService.getCardListAll(this.personTypeId).subscribe(
      (response) => {
        this.cardList = response.data.cards;
        // console.log('All cards loaded:', this.cardList);
      },
      (error) => {
        console.error('Ошибка при загрузке всех карт', error);
      },
    );
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    if (tab === 'all') {
      this.currentBrandId = null;
      this.loadAllCards();
    } else {
      this.loadCards();
    }
  }
  onCardClick(cardId: number) {
    this.cardsService.getCardContentItem(cardId).subscribe(
      (details) => {
        this.contentItem = details.data.card_content_items;
        // console.log(details);
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      },
    );
  }
}
