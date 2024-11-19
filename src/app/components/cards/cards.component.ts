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
  currentBrandId: number = 1; 
  selectedTab: string = 'all';


  constructor(private cardsService: CardsService, private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.currentPersonTypeId.subscribe(id => {
      this.personTypeId = id;
      this.loadCards();
    });

    this.selectedBrandId$.subscribe(() => {
      this.loadCards();
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

  selectBrand(brandId: number) {
    this.selectedBrandId.next(brandId);
    this.currentBrandId = brandId;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
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
