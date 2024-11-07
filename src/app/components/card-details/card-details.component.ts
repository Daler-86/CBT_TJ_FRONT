import { Component ,HostListener, ElementRef, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardsService } from '../../api/cards.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card, cardFaqs, cardLimits, cardOperations, helpfulDocument } from '../../models/cards.model';
import { RegionService } from '../../api/region.service';
import { officeList } from '../../models/region.model';

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
  faqs:cardFaqs[]=[]
  card:Card[]=[]
offices:officeList[]=[]
select:any
officeName:string='Выберите отделение банка'
  model = {
    card_id: 0,
    client_name: '',
    office_id: 0,
    phone: ''
  };  
    selectedFaqIndex: number | null = null;
  dropdownOpen:boolean=false;
  selectedTab: string = 'services';
  constructor(
    private route: ActivatedRoute,
    private cardsService: CardsService,
    private regionService:RegionService,
    private elementRef: ElementRef,
  ) { }

  
  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.loadTabData(tab,this.cardId);
  }
    toggleFaq(index: number) {
      this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
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
    this.loadCardFaqs(this.cardId)
    this.loadTabData(this.selectedTab, this.cardId);
    // this.loadCardByBrand(this.cardId)
    this.loadOffice()
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
  loadCardFaqs(id: number): void {
    this.cardsService.getCardFaqs(id).subscribe(
      (details) => { 
        this.faqs=details.data.card_faqs
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
  }
  // loadCardByBrand(id: number): void {
  //   this.cardsService.getCardByBrand(id).subscribe(
  //     (details) => { 
  //       this.card=details.data.cards
  //       console.log(this.card)
  //     },
  //     (error) => {
  //       console.error('Ошибка при получении деталей карты', error);
  //     }
  //   );
  // }
  loadOffice(): void {
    this.regionService.getOfficeList().subscribe(
      (response) => {
        this.offices = response.data.offices;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }
  submitApplication() {
    debugger
    if (this.model.phone && this.model.client_name && this.model.office_id) {
      console.log(this.model)
      this.model.card_id=this.cardId
      this.cardsService.submitCardByBrand(this.model).subscribe(resp =>{
        console.log(resp);
        
      },(err =>{
        console.log(err);
      }));
  }
}
toggleDropdown(event: Event) {
  this.dropdownOpen = !this.dropdownOpen;
  event.stopPropagation(); // Останавливаем распространение события
}
@HostListener('document:click', ['$event'])

selectOption( event: Event,item:officeList) {
  this.officeName = item?.name; // Обновляем имя для отображения
  this.model.office_id = item?.id; 
  event.stopPropagation();
  this.dropdownOpen = false;

}

}
