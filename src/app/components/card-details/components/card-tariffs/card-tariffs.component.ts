import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardsService } from '../../../../api/cards.service';
import { cardServices, cardLimits, cardOperations, helpfulDocument } from '../../../../models/cards.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-tariffs',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './card-tariffs.component.html',
  styleUrl: './card-tariffs.component.scss',
})
export class CardTariffsComponent implements OnInit {
  cardId = 0;
  @Input() imageUrl: string = '';
  selectedTab = 'services';
  services: cardServices[] = [];
  limits: cardLimits[] = [];
  operations: cardOperations[] = [];
  documents: helpfulDocument[] = [];
  private route = inject(ActivatedRoute);
  private cardsService = inject(CardsService);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cardId = +idParam;
      // Загружаем все данные для страницы

      this.loadTabData(this.selectedTab, this.cardId);
    }
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.loadTabData(tab, this.cardId);
  }

  private loadTabData(tab: string, id: number): void {
    switch (tab) {
      case 'services':
        this.cardsService.getCardServices(id).subscribe(
          (details) => {
            this.services = details.data.card_services;
          },
          (error) => console.error('Ошибка при получении сервисов', error),
        );
        break;
      case 'limits':
        this.cardsService.getCardLimits(id).subscribe((data) => (this.limits = data.data.card_limits));
        break;
      case 'operations':
        this.cardsService.getCardOperation(id).subscribe((data) => (this.operations = data.data.card_operations));
        break;
      case 'documents':
        this.cardsService
          .getCardhDocuments(id)
          .subscribe((data) => (this.documents = data.data['card-helpful-documents']));
        break;
    }
  }
}
