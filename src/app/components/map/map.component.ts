import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component,ElementRef,HostListener, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RegionService } from '../../api/region.service';
import { Atm, FilteredData, Office, Terminal, officeList, regionList } from '../../models/region.model';
import { cardFaqs } from '../../models/cards.model';
import { CardsService } from '../../api/cards.service';
import { OfficeListComponent } from "../office-list/office-list.component";
interface Marker {
  position: google.maps.LatLngLiteral;
  label: string;
  info: string;
  type: 'office' | 'atm' | 'terminal';
}
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule,  RouterModule, TranslateModule, NgIf, NgFor, CommonModule, OfficeListComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})


// export class MapComponent {
//   constructor(
//     private filterService: RegionService,
//     private translateService: TranslateService,
//     private cardsService: CardsService
//   ) {}

//   center: google.maps.LatLngLiteral = { lat: 38.5367, lng: 68.7803 };
//   zoom = 13;
//   selectedTab: string = 'NaKarte';
//   markers = [
//     { position: { lat: 38.5367, lng: 68.7803 }, label: '1', info: 'Точка 1' },
//     { position: { lat: 38.5377, lng: 68.7853 }, label: '2', info: 'Точка 2' },
//     { position: { lat: 38.5407, lng: 68.7903 }, label: '3', info: 'Точка 3' },
//   ];

//   // offices: any[] = [];
//   filterOptions: {
//     types: string[];
//     accessibility: string[];
//     additional: string[];
//   } = {
//     types: [],
//     accessibility: [],
//     additional: [],
//   };

//   allSelected: boolean = false;
//   terminalsSelected: boolean = false;
//   officesSelected: boolean = false;
//   atmsSelected: boolean = false;
  
//   is24Selected: boolean = false;
//   workingNowSelected: boolean = false;
  
//   qrCodeSelected: boolean = false;
//   nfcSelected: boolean = false;

//   dropdownOpen: boolean = false;
//   dropdownOpen2: boolean = false;

//   regionSelected:number=0
//   regionList: any[] = [];
//   faqs: { title: string; description: string }[] = [];
//   selectedFaqIndex: number | null = null;
// offices:Office[]=[];
// atms:Atm[]=[];
// terminals:Terminal[]=[];
 
// data:any[]=[]
//   @HostListener('document:click', ['$event'])
//   closeDropdownsManual(event: Event): void {
//     const target = event.target as HTMLElement;
//     if (!target.closest('.custom-dropdown')) {
//       this.dropdownOpen = false;
//       this.dropdownOpen2 = false;
//     }
//   }
//   selectTab(tab: string) {
//     this.selectedTab = tab;
//   }
//   toggleDropdown(event: Event): void {
//     this.dropdownOpen = !this.dropdownOpen;
//     // event.stopPropagation();
//   }

//   toggleDropdown2(event: Event): void {
//     this.dropdownOpen2 = !this.dropdownOpen2;
//     // event.stopPropagation();
//   }

//   showInfo(markerInfo: string) {
//     alert(markerInfo);
//   }
//   regionSelectedName='Город'
//   ngOnInit(): void {
//     document.addEventListener('click', this.closeDropdownsManual.bind(this));


//     this.filterService.getRegionList().subscribe(
//       (response) => {
//         this.regionList = response.data.regions;
//       },
//       (error) => {
//         console.error('Ошибка при запросе данных', error);
//       }
//     );
//     this.allSelected = true;
//     this.loadCardFaqs();
//    this.sendFilteredData();
//   }

//   loadCardFaqs(): void {
//     this.filterService.getCardFaqs().subscribe(
//       (details) => {
//         this.faqs = details.data.office_faqs;
//       },
//       (error) => {
//         console.error('Ошибка при получении деталей карты', error);
//       }
//     );
//   }

//   toggleFaq(index: number) {
//     this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
//   }



//   ngOnDestroy(): void {
//     document.removeEventListener('click', this.closeDropdownsManual.bind(this));
//     this.sendFilteredData()
//   }
//   combinedData: any[] = [];
//   sendFilteredData(): void {
//     this.filterService.getFilteredData(this.atmsSelected, this.is24Selected, this.officesSelected, this.regionSelected, this.terminalsSelected, this.workingNowSelected).subscribe({
//       next: (response) => {
//         console.log('Filtered data received:', response);
//              this.terminals=response.data.terminals
//              this.atms=response.data.atms
//              this.offices=response.data.offices
//              debugger
//              this.combinedData = [
//               ...(response.data.terminals || []),
//               ...(response.data.atms || []),
//               ...(response.data.offices || [])
//             ];
//       },
//       error: (err) => {
//         console.error('Error fetching filtered data:', err);
//       }
//     });
//   }
//   onCheckboxChange(variableName: string, event: Event): void {
//     const inputElement = event.target as HTMLInputElement;
  
//     // Проверяем, существует ли свойство
//     if (inputElement && variableName in this) {
//       (this as any)[variableName] = inputElement.checked;
//       console.log(`${variableName} changed to:`, (this as any)[variableName]);
//       this.sendFilteredData()
//     }
//   }

//   onRegionChange(obj:any){
//     this.regionSelected=obj.id
//     this.regionSelectedName=obj.name
//     this.sendFilteredData()
//     this.dropdownOpen2=false
//   }
// }


export class MapComponent implements OnInit, OnDestroy {
  constructor(
    private filterService: RegionService,
    private translateService: TranslateService,
    private cardsService: CardsService
  ) {}

  // Центр карты
  center: google.maps.LatLngLiteral = { lat: 38.5367, lng: 68.7803 };
  // Уровень масштабирования
  zoom = 13;
  // Выбранная вкладка
  selectedTab: string = 'NaKarte';

  // Пути к иконкам для разных типов маркеров
  ATM_ICON = '../../../assets/icons/atms.svg';
  TERMINAL_ICON = '../../../assets/icons/terminals.svg';
  OFFICE_ICON = '../../../assets/icons/offices.svg';

  // Фильтры (можно настроить по необходимости)
  filterOptions: {
    types: string[];
    accessibility: string[];
    additional: string[];
  } = {
    types: [],
    accessibility: [],
    additional: [],
  };

  // Флаги для фильтров
  allSelected: boolean = false;
  terminalsSelected: boolean = false;
  officesSelected: boolean = false;
  atmsSelected: boolean = false;

  is24Selected: boolean = false;
  workingNowSelected: boolean = false;

  qrCodeSelected: boolean = false;
  nfcSelected: boolean = false;

  dropdownOpen: boolean = false;
  dropdownOpen2: boolean = false;

  regionSelected: number = 0;
  regionList: any[] = [];
  faqs: { title: string; description: string }[] = [];
  selectedFaqIndex: number | null = null;
  regionSelectedName: string = '';
  // Массивы данных
  offices: Office[] = [];
  atms: Atm[] = [];
  terminals: Terminal[] = [];

  // Массив маркеров
  markers: Marker[] = [];
  // Активный маркер для InfoWindow
  activeMarker: Marker | null = null;

  // Имя выбранного региона
  // regionSelectedName: string = 'Город';

  @HostListener('document:click', ['$event'])
  closeDropdownsManual(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.dropdownOpen = false;
      this.dropdownOpen2 = false;
    }
  }

  ngOnInit(): void {
    document.addEventListener('click', this.closeDropdownsManual.bind(this));

    // Загрузка списка регионов
    this.filterService.getRegionList().subscribe(
      (response) => {
        this.regionList = response.data.regions;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );

    this.translateService.get('mapPage.filters.regionPlaceholder').subscribe(translation => {
      this.regionSelectedName = translation;
    });
    // Установка флага "Все выбраны"
    this.allSelected = true;

    // Загрузка FAQ для карты
    this.loadCardFaqs();

    // Загрузка и отображение данных на карте
    this.sendFilteredData();
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.closeDropdownsManual.bind(this));
  }

  // Загрузка FAQ для карты
  loadCardFaqs(): void {
    this.filterService.getCardFaqs().subscribe(
      (details) => {
        this.faqs = details.data.office_faqs;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
  }

  // Переключение FAQ
  toggleFaq(index: number) {
    this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
  }

  // Отправка фильтрованных данных и формирование маркеров
  sendFilteredData(): void {
    this.filterService
      .getFilteredData(
        this.atmsSelected,
        this.is24Selected,
        this.officesSelected,
        this.regionSelected,
        this.terminalsSelected,
        this.workingNowSelected
      )
      .subscribe({
        next: (response) => {
          // console.log('Filtered data received:', response);
          this.terminals = response.data.terminals || [];
          this.atms = response.data.atms || [];
          this.offices = response.data.offices || [];

          // Формируем markers с типом
          this.markers = [
            ...this.parseTerminals(this.terminals),
            ...this.parseAtms(this.atms),
            ...this.parseOffices(this.offices),
          ];
          
        },
        error: (err) => {
          console.error('Error fetching filtered data:', err);
        },
      });
  }

  parseTerminals(terminals: Terminal[]): Marker[] {
    const terminalLabel = this.translateService.instant('mapPage.infoWindow.terminalLabel');
    const addressLabel = this.translateService.instant('mapPage.infoWindow.addressLabel');

    return terminals
      .map((terminal) => {
        const lat = this.extractLatitude(terminal.latitude);
        const lng = this.extractLongitude(terminal.longitude);

        if (lat !== null && lng !== null) {
          return {
            position: { lat, lng },
            label: terminal.name,
            // Строка формируется с переведенными метками
            info: `<strong>${terminalLabel}:</strong> ${terminal.name}<br><strong>${addressLabel}:</strong> ${terminal.address}`,
            type: 'terminal',
          } as Marker;
        }
        console.warn('Некорректные координаты терминала:', terminal);
        return null;
      })
      .filter((marker): marker is Marker => marker !== null);
  }

  // ИЗМЕНЕНО: Метод теперь использует translateService.instant()
  parseAtms(atms: Atm[]): Marker[] {
    const atmLabel = this.translateService.instant('mapPage.infoWindow.atmLabel');
    const addressLabel = this.translateService.instant('mapPage.infoWindow.addressLabel');

    return atms
      .map((atm) => {
        const lat = this.extractLatitude(atm.latitude);
        const lng = this.extractLongitude(atm.longitude);

        if (lat !== null && lng !== null) {
          return {
            position: { lat, lng },
            label: atm.name,
            // Строка формируется с переведенными метками
            info: `<strong>${atmLabel}:</strong> ${atm.name}<br><strong>${addressLabel}:</strong> ${atm.address}`,
            type: 'atm',
          } as Marker;
        }
        console.warn('Некорректные координаты банкомата:', atm);
        return null;
      })
      .filter((marker): marker is Marker => marker !== null);
  }

  // ИЗМЕНЕНО: Метод теперь использует translateService.instant()
  parseOffices(offices: Office[]): Marker[] {
    const officeLabel = this.translateService.instant('mapPage.infoWindow.officeLabel');
    const addressLabel = this.translateService.instant('mapPage.infoWindow.addressLabel');

    return offices
      .map((office) => {
        const lat = this.extractLatitude(office.latitude);
        const lng = this.extractLongitude(office.longitude);

        if (lat !== null && lng !== null) {
          return {
            position: { lat, lng },
            label: office.name,
            // Строка формируется с переведенными метками
            info: `<strong>${officeLabel}:</strong> ${office.name}<br><strong>${addressLabel}:</strong> ${office.address}`,
            type: 'office',
          } as Marker;
        }
        console.warn('Некорректные координаты офиса:', office);
        return null;
      })
      .filter((marker): marker is Marker => marker !== null);
  }
  // Извлечение широты из строки
  extractLatitude(latStr: string): number | null {
    const parts = latStr.split(',');
    const lat = parseFloat(parts[0].trim());
    return isNaN(lat) ? null : lat;
  }

  // Извлечение долготы из строки
  extractLongitude(lngStr: string): number | null {
    const parts = lngStr.split(',');
    const lng = parseFloat(parts[0].trim());
    return isNaN(lng) ? null : lng;
  }

  // Получение иконки в зависимости от типа маркера
  getMarkerIcon(type: 'atm' | 'office' | 'terminal'): string {
    switch (type) {
      case 'atm':
        return this.ATM_ICON;
      case 'terminal':
        return this.TERMINAL_ICON;
      case 'office':
        return this.OFFICE_ICON;
      default:
        return '';
    }
  }

  // Отображение информационного окна
  showInfo(marker: Marker): void {
    this.activeMarker = marker;
  }

  // Скрытие информационного окна
  hideInfo(): void {
    this.activeMarker = null;
  }

  // Обработка изменений чекбоксов фильтров
  onCheckboxChange(variableName: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    // Проверяем, существует ли свойство
    if (inputElement && variableName in this) {
      (this as any)[variableName] = inputElement.checked;
      // console.log(`${variableName} changed to:`, (this as any)[variableName]);
      this.sendFilteredData();
    }
  }

  // Обработка изменения региона
  onRegionChange(obj: any) {
    this.regionSelected = obj.id;
    this.regionSelectedName = obj.name;
    this.sendFilteredData();
    this.dropdownOpen2 = false;
  }

  // Переключение вкладки
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  // Переключение выпадающего меню 1
  toggleDropdown(event: Event): void {
    this.dropdownOpen = !this.dropdownOpen;
    // event.stopPropagation();
  }

  // Переключение выпадающего меню 2
  toggleDropdown2(event: Event): void {
    this.dropdownOpen2 = !this.dropdownOpen2;
    // event.stopPropagation();
  }
}



