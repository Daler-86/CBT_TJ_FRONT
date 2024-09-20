import { Component , OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardsService } from '../../api/cards.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cardLimits, cardOperations, cardServices, helpfulDocument } from '../../models/cards.model';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [NgFor, NgIf,FormsModule],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss'
})
export class CardDetailsComponent implements OnInit {
  cardId: number=0;
  cardDetails: any; // Замените any на ваш тип данных
  services: any;
  limits: cardLimits[]=[];
  operations: cardOperations[]=[];
  documents: helpfulDocument[]=[];
  constructor(
    private route: ActivatedRoute,
    private cardsService: CardsService
  ) { }
    selectedTab: string = 'services';
  
  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.loadTabData(tab,this.cardId);
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


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.cardId= +idParam;  // Преобразование строки в число
    } else {
      console.error('ID is missing in the route parameters.');
      // Здесь может быть код для обработки ситуации отсутствия ID
    }

    this.loadCardDetails(this.cardId);
    this.loadTabData(this.selectedTab, this.cardId);
  }


  loadTabData(tab: string,id:number): void {
    switch (tab) {
      case 'services':
        this.cardsService.getCardServices(id).subscribe(
          (details) => {
        
            this.services=details.data.card_services  
            
          },
          (error) => {
            console.error('Ошибка при получении деталей карты', error);
          }
        );
   
      
        
        break;
      case 'limits':
        this.cardsService.getCardLinits(id).subscribe(data => this.limits = data.data.card_limits);
        break;
      case 'operations':
        this.cardsService.getCardOperation(id).subscribe(data => this.operations = data.data.card_operations);
        break;
      case 'documents':
        this.cardsService.getCardhDocuments(id).subscribe(data => this.documents = data.data['card-helpful-documents']);
        break;
    }
  }
  loadCardDetails(id: number): void {
    this.cardsService.getCardContentItem(id).subscribe(
      (details) => {
        this.cardDetails=details.data.card_content_items
     
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
  }
}
