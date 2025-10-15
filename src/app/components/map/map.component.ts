// src/app/components/map/map.component.ts

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// --- Модели и Сервисы ---
import { RegionService } from '../../api/region.service';
import { CardsService } from '../../api/cards.service';
import { Atm, Office, Terminal } from '../../models/region.model';

// --- Компоненты и Интерфейсы ---
import { OfficeListComponent } from "../office-list/office-list.component";
import { YandexMapComponent, IMapPoint } from '../yandex-map/yandex-map.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, OfficeListComponent, YandexMapComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  // --- Свойства для UI ---
  selectedTab: string = 'NaKarte';
  dropdownOpen: boolean = false;
  dropdownOpen2: boolean = false;
  regionList: any[] = [];
  regionSelectedName: string = '';
  faqs: { title: string; description: string }[] = [];
  selectedFaqIndex: number | null = null;
  public selectedPoint: IMapPoint | null = null;
  // --- Свойства для карты ---
  mapPoints: IMapPoint[] = [];

  // --- Свойства для фильтров ---
  allSelected: boolean = true;
  terminalsSelected: boolean = false;
  officesSelected: boolean = false;
  atmsSelected: boolean = false;
  is24Selected: boolean = false;
  workingNowSelected: boolean = false;
  regionSelected: number = 0;
  // nfcSelected и qrCodeSelected пока не используются в getFilteredData, но оставим их
  nfcSelected: boolean = false;
  qrCodeSelected: boolean = false;

  constructor(
    private filterService: RegionService,
    private translateService: TranslateService,
    private cardsService: CardsService // cardsService используется? Если нет, можно удалить.
  ) {}

  ngOnInit(): void {
    document.addEventListener('click', this.closeDropdownsManual.bind(this));
    this.loadRegionList();
    this.translateService.get('MAP_PAGE.FILTERS.REGION_PLACEHOLDER').subscribe(translation => {
      this.regionSelectedName = translation;
    });
    this.loadCardFaqs();
    this.sendFilteredData();
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.closeDropdownsManual.bind(this));
  }

  // --- Методы для загрузки данных ---
  public onPointSelect(point: IMapPoint): void {
    this.selectedPoint = point;
    
    // Здесь мы могли бы центрировать карту, но YandexMapComponent уже делает это
    // при клике на кластер, а для одиночной метки это не так критично.
    // Если нужно, можно будет добавить.
  }
  public closeSidebar(): void {
    this.selectedPoint = null;
  }

  loadRegionList(): void {
    this.filterService.getRegionList().subscribe({
      next: (response) => this.regionList = response.data.regions,
      error: (err) => console.error('Ошибка при загрузке регионов', err)
    });
  }

  loadCardFaqs(): void {
    this.filterService.getCardFaqs().subscribe({
      next: (details) => this.faqs = details.data.office_faqs,
      error: (err) => console.error('Ошибка при загрузке FAQ', err)
    });
  }

  // --- ГЛАВНЫЙ МЕТОД: Фильтрация и подготовка данных для карты ---

  sendFilteredData(): void {
    this.filterService.getFilteredData(
      this.atmsSelected || this.allSelected,
      this.is24Selected,
      this.officesSelected || this.allSelected,
      this.regionSelected,
      this.terminalsSelected || this.allSelected,
      this.workingNowSelected
    ).subscribe({
      next: (response) => {
        const offices = response.data.offices || [];
        const atms = response.data.atms || [];
        const terminals = response.data.terminals || [];

        const officePoints = this.parseData(offices, 'office');
        const atmPoints = this.parseData(atms, 'atm');
        const terminalPoints = this.parseData(terminals, 'terminal');
        
        this.mapPoints = [...officePoints, ...atmPoints, ...terminalPoints];
      },
      error: (err) => {
        console.error('Ошибка при загрузке отфильтрованных данных:', err);
        this.mapPoints = [];
      }
    });
  }

  // --- УНИВЕРСАЛЬНЫЙ ПАРСЕР ДАННЫХ ---

  private parseData(items: (Office | Atm | Terminal)[], type: 'office' | 'atm' | 'terminal'): IMapPoint[] {
    const landmarkLabel = this.translateService.instant('mapPage.infoWindow.landmarkLabel'); // Предполагаем, что есть такой ключ перевода
    const iconPaths = {
      office: '../../../assets/icons/offices.svg',
      atm: '../../../assets/icons/atms.svg',
      terminal: '../../../assets/icons/terminals.svg'
    };

    return items.map((item): IMapPoint | null => {
      const coords = this.getCoordinates(item.latitude, item.longitude);
      if (!coords) return null;

      
      const isWorking = item.is_24_time === true;
      const services=item.is_24_time
      const workHoursText = isWorking ? 'Круглосуточно' : 'Пн-Пт: 08:00-17:00, Сб: 08:00-12:00'; // Задаем реальный график
      const statusClass = isWorking ? 'status--open' : 'status--closed'; // Здесь нужна логика проверки текущего времени
      
      return {
        id: item.id,
        // --- ГЛАВНОЕ ИСПРАВЛЕНИЕ ---
        geometry: { type: 'Point', coordinates: coords },
        properties: {
          type: type,
          title: item.name,
          address: item.address,
          workHours: workHoursText,
          statusClass: statusClass,
          iconSrc: iconPaths[type],
          // Добавим поле для боковой панели
          items: (item as any).items || [],
           services: (item as any).services || [] // Предполагаем, что с бэка приходят услуги
        }
      };
    }).filter(Boolean) as IMapPoint[];
  }
  

  private getCoordinates(latStr: string, lngStr: string): [number, number] | null {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) {
      console.warn('Некорректные координаты:', { latStr, lngStr });
      return null;
    }
    return [lat, lng];
  }

  // --- Методы для UI (остаются без изменений) ---

  toggleFaq(index: number): void {
    this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
  }
  
  onCheckboxChange(variableName: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (variableName in this) {
      (this as any)[variableName] = inputElement.checked;
      
      // Логика для чекбокса "Все"
      if (variableName === 'allSelected' && inputElement.checked) {
        this.officesSelected = false;
        this.atmsSelected = false;
        this.terminalsSelected = false;
      } else if (['officesSelected', 'atmsSelected', 'terminalsSelected'].includes(variableName) && inputElement.checked) {
        this.allSelected = false;
      }
    }
    this.sendFilteredData();
  }

  onRegionChange(option: any): void {
    if (option === 0) {
      this.regionSelected = 0;
      this.translateService.get('mapPage.filters.regionPlaceholder').subscribe(translation => {
        this.regionSelectedName = translation;
      });
    } else {
      this.regionSelected = option.id;
      this.regionSelectedName = option.name;
    }
    this.sendFilteredData();
    this.dropdownOpen2 = false;
  }
  
  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
  
  @HostListener('document:click', ['$event'])
  closeDropdownsManual(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.dropdownOpen = false;
      this.dropdownOpen2 = false;
    }
  }

  toggleDropdown(event: Event): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.dropdownOpen2 = false;
    event.stopPropagation();
  }
  
  toggleDropdown2(event: Event): void {
    this.dropdownOpen2 = !this.dropdownOpen2;
    this.dropdownOpen = false;
    event.stopPropagation();
  }
}


