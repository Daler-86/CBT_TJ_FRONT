import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardsService } from '../../api/cards.service';
import { Card, CardBrand } from '../../models/cards.model'; 
import { MenuService } from '../../api/menu.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, NgIf, NgFor,CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})

export class CardsComponent implements OnInit {
  cardList: any[] = [];
  cardBrands: any[] = [];
  contentItem: any[] = [];
  personTypeId: number = 1;
  selectedBrandId = new BehaviorSubject<number>(1);
  selectedBrandId$ = this.selectedBrandId.asObservable();
  currentBrandId: any = null; 
  selectedTab: string = 'all';
  constructor(private cardsService: CardsService, private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.menuService.currentPersonTypeId.subscribe(id => {
      this.personTypeId = id;
      this.loadAllCards(); // Загрузка всех карт по умолчанию
    });
  
    this.loadCardBrands();
  }

  loadCards() {
    this.cardsService.getCardList(this.personTypeId, this.selectedBrandId.getValue()).subscribe(
      (response) => {
        this.cardList = response.data.cards;
        console.log('cardList updated:', this.cardList);
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }
  loadCardBrands() {
    this.cardsService.getCardBrands().subscribe(
      (response) => {
        this.cardBrands = response.data.card_brands;
    
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
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
        console.log('All cards loaded:', this.cardList);
      },
      (error) => {
        console.error('Ошибка при загрузке всех карт', error);
      }
    );
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    if (tab === 'all') {
      this.currentBrandId=null;
      this.loadAllCards();
    } else {
      this.loadCards();
    }
  }
  onCardClick(cardId: number) {
    this.cardsService.getCardContentItem(cardId).subscribe(
      (details) => {
        this.contentItem = details.data.card_content_items;
        console.log(details);
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
  }

}
