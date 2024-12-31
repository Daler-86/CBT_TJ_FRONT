import { Component ,HostListener, ElementRef, OnInit, ViewChild,} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardsService } from '../../api/cards.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card, CardList, cardDetail, cardFaqs, cardLimits, cardOperations, helpfulDocument } from '../../models/cards.model';
import { RegionService } from '../../api/region.service';
import { officeList } from '../../models/region.model';
import { MenuService } from '../../api/menu.service';
import { BehaviorSubject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [NgFor, NgIf,FormsModule, TranslateModule],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss'
})
export class CardDetailsComponent implements OnInit {
  cardId: number=0;
  cardContent: any; // Замените any на ваш тип данных
  services: any;
  limits: cardLimits[]=[];
  operations: cardOperations[]=[];
  documents: helpfulDocument[]=[];
  faqs:cardFaqs[]=[]
offices:officeList[]=[]
select:any
officeName:string='Выберите отделение банка'
  model = {
    card_id: 0,
    client_name: '',
    office_id: 0,
    phone: ''
  };  
  cardData:any={}
  personTypeId: number = 1;
    selectedFaqIndex: number | null = null;
  dropdownOpen:boolean=false;
  selectedTab: string = 'services';
  selectedBrandId = new BehaviorSubject<number>(1);
  selectedBrandId$ = this.selectedBrandId.asObservable();
  constructor(
    private route: ActivatedRoute,
    private cardsService: CardsService,
    private regionService:RegionService,
    private elementRef: ElementRef,
    private menuService: MenuService
  ) { }

  
  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.loadTabData(tab,this.cardId);
  }
    toggleFaq(index: number) {
      this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
    }
    @ViewChild('applicationForm') applicationForm!: ElementRef;
    scrollToFormFlag = false;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.cardId= +idParam;  // Преобразование строки в число
    } else {
      console.error('ID is missing in the route parameters.');
      // Здесь может быть код для обработки ситуации отсутствия ID
    }
    this.loadCards(this.cardId);
    this.loadCardDetails(this.cardId);
    this.loadCardFaqs(this.cardId)
    this.loadTabData(this.selectedTab, this.cardId);
    this.loadOffice()
  
  }

  ngAfterViewInit(): void {
    // Проверяем, нужно ли прокручивать к форме
    this.route.queryParams.subscribe((params) => {
      if (params['scrollToForm'] === 'true') {
        this.scrollToForm();
      }
    });
  }

  scrollToForm(): void {
    const element = this.applicationForm.nativeElement;
    const headerHeight = document.querySelector('.header')?.clientHeight || 0; // Учитываем фиксированный заголовок
    const offsetTop = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  }
  loadCards(id:number):void {
    this.cardsService.getCardData(id).subscribe(
      (response) => {
        this.cardData = response.data.card_data;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
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
        this.cardsService.getCardLimits(id).subscribe(data => this.limits = data.data.card_limits);
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
        this.cardContent=details.data.card_content_items
     
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
