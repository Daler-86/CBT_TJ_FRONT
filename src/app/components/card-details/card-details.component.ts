import { Component ,HostListener, ElementRef, OnInit, ViewChild, OnDestroy,} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardsService } from '../../api/cards.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card, CardList, cardDetail, cardFaqs, cardLimits, cardOperations, helpfulDocument } from '../../models/cards.model';
import { RegionService } from '../../api/region.service';
import { officeList } from '../../models/region.model';
import { MenuService } from '../../api/menu.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import {environment} from "../../../environments/environment";
import { ModalService } from '../../services/modal.service';
import { ScrollToDirective } from '../../directives/scroll-to.directive';
import { ScrollService } from '../../services/scroll.service';
import { TranslateService } from '@ngx-translate/core'; 
@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [NgFor, NgIf,FormsModule, TranslateModule, ReactiveFormsModule, ScrollToDirective],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss'
})
export class CardDetailsComponent implements OnInit, OnDestroy {
  imageUrl: string = environment.IMAGE_URL;
  cardId: number = 0;
  cardData: any = {};
  cardContent: any;
  services: any;
  limits: cardLimits[] = [];
  operations: cardOperations[] = [];
  documents: helpfulDocument[] = [];
  faqs: cardFaqs[] = [];
  offices: officeList[] = [];
  private langChangeSubscription: Subscription | undefined;
  // Свойства для UI
  selectedTab: string = 'services';
  selectedFaqIndex: number | null = null;
  dropdownOpen: boolean = false;
  officeName: string = ''; 

  // Реактивная форма
  public applicationForm: FormGroup;
  @ViewChild('formElement') formElementRef!: ElementRef;
  @ViewChild('customDropdown') dropdownRef!: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private cardsService: CardsService,
    private regionService: RegionService,
    private notificationService: ModalService,
    private scrollService:ScrollService,
    private translateService: TranslateService,
    private fb: FormBuilder // Внедряем FormBuilder
  ) {
    // Инициализируем форму в конструкторе
    this.applicationForm = this.fb.group({
      client_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\s()-]*$')]], // Паттерн для телефонов
      office_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cardId = +idParam;
      // Загружаем все данные для страницы
      this.loadCards(this.cardId);
      this.loadCardDetails(this.cardId);
      this.loadCardFaqs(this.cardId);
      this.loadTabData(this.selectedTab, this.cardId);
      this.loadOffice();
    }
    this.route.queryParams.subscribe(params => {
      const anchor = params['scrollTo']; // Ищем параметр 'scrollTo' в URL
      if (anchor) {
        // Если параметр есть, вызываем наш сервис
        this.scrollService.scrollToAnchor(anchor);
      }
    });
    this.updateOfficePlaceholder();

    // === 6. ПОДПИСЫВАЕМСЯ НА СОБЫТИЕ СМЕНЫ ЯЗЫКА ===
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      // Этот код будет выполняться КАЖДЫЙ РАЗ, когда меняется язык
      this.updateOfficePlaceholder();
    });
    this.translateService.get('forms.placeholders.selectOffice').subscribe(translation => {
      // Когда перевод будет готов, присваиваем его нашей переменной
      this.officeName = translation;
    });
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    // Проверяем, что клик был сделан НЕ внутри нашего кастомного селектора
    // и что селектор в данный момент открыт
    if (this.dropdownOpen && !this.dropdownRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false; // Закрываем его
    }
  }
  updateOfficePlaceholder(): void {
    // Если офис еще не выбран, обновляем плейсхолдер
    if (!this.applicationForm.get('office_id')?.value) {
      this.translateService.get('forms.placeholders.selectOffice').subscribe(translation => {
        this.officeName = translation;
      });
    }
  }
  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
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
  scrollToForm(): void {
    // Используем новое имя переменной
    const element = this.formElementRef.nativeElement;
    const headerHeight = document.querySelector('.header')?.clientHeight || 0;
    const offsetTop = element.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  }
  // Метод выбора офиса
  selectOption(item: officeList): void {
    this.officeName = item.name;
    this.applicationForm.get('office_id')?.setValue(item.id);
    this.dropdownOpen = false;
  }
  
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Метод отправки формы
  submitApplication(): void {
    this.applicationForm.markAllAsTouched(); // Помечаем все поля как "тронутые" для показа ошибок

    if (this.applicationForm.invalid) {
      this.notificationService.show('Пожалуйста, заполните все поля корректно.', 'error');
      return;
    }

    const dataToSend = {
      card_id: this.cardId,
      ...this.applicationForm.value // Берем все значения из формы
    };

    

    this.cardsService.submitCardByBrand(dataToSend).subscribe({
      next: (response) => {
        this.notificationService.show('Ваша заявка успешно принята!', 'success');
        this.applicationForm.reset(); // Сбрасываем форму
        this.updateOfficePlaceholder();
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Не удалось отправить заявку. Попробуйте позже.';
        this.notificationService.show(errorMessage, 'error');
      }
    });
  }

  // Геттеры для удобного доступа к контролам в шаблоне
  get client_name() { return this.applicationForm.get('client_name'); }
  get phone() { return this.applicationForm.get('phone'); }
  get office_id() { return this.applicationForm.get('office_id'); }
  


  
  selectedBrandId = new BehaviorSubject<number>(1);
  selectedBrandId$ = this.selectedBrandId.asObservable();
  



  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.loadTabData(tab,this.cardId);
  }
    toggleFaq(index: number) {
      this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
    }

    scrollToFormFlag = false;

 



 
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


}
