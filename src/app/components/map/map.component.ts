
import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RegionService } from '../../api/region.service';

import { Atm, Office, Terminal, regionList, TerminalItem } from '../../models/region.model';
import { OfficeListComponent } from '../office-list/office-list.component';
import { YandexMapComponent } from '../yandex-map/yandex-map.component';
import { IMapPoint, Services } from '../../models/map.model';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, OfficeListComponent, YandexMapComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  selectedTab = 'NaKarte';
  dropdownOpen = false;
  dropdownOpen2 = false;
  regionList: regionList[] = [];
  regionSelectedName = '';
  faqs: { title: string; description: string }[] = [];
  selectedFaqIndex: number | null = null;
  public selectedPoint: IMapPoint | null = null;
  mapPoints: IMapPoint[] = [];

  allSelected = true;
  terminalsSelected = false;
  officesSelected = false;
  atmsSelected = false;
  is24Selected = false;
  workingNowSelected = false;
  regionSelected = 0;
  nfcSelected = false;
  qrCodeSelected = false;
  private filterService = inject(RegionService);
  private translateService = inject(TranslateService);

  ngOnInit(): void {
    document.addEventListener('click', this.closeDropdownsManual.bind(this));
    this.loadRegionList();
    this.translateService.get('MAP_PAGE.FILTERS.REGION_PLACEHOLDER').subscribe((translation) => {
      this.regionSelectedName = translation;
    });
    this.loadCardFaqs();
    this.sendFilteredData();
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.closeDropdownsManual.bind(this));
  }

  public onPointSelect(point: IMapPoint): void {
    this.selectedPoint = point;

  }
  public closeSidebar(): void {
    this.selectedPoint = null;
  }

  loadRegionList(): void {
    this.filterService.getRegionList().subscribe({
      next: (response) => (this.regionList = response.data.regions),
      error: (err) => console.error('Ошибка при загрузке регионов', err),
    });
  }

  loadCardFaqs(): void {
    this.filterService.getCardFaqs().subscribe({
      next: (details) => (this.faqs = details.data.office_faqs),
      error: (err) => console.error('Ошибка при загрузке FAQ', err),
    });
  }

  sendFilteredData(): void {
    this.filterService
      .getFilteredData(
        this.atmsSelected || this.allSelected,
        this.is24Selected,
        this.officesSelected || this.allSelected,
        this.regionSelected,
        this.terminalsSelected || this.allSelected,
        this.workingNowSelected,
      )
      .subscribe({
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
        },
      });
  }


  private parseData(items: (Office | Atm | Terminal)[], type: 'office' | 'atm' | 'terminal'): IMapPoint[] {
    const iconPaths = {
      office: '../../../assets/icons/offices.svg',
      atm: '../../../assets/icons/atms.svg',
      terminal: '../../../assets/icons/terminals.svg',
    };

    return items
      .map((item): IMapPoint | null => {
        const coords = this.getCoordinates(item.latitude, item.longitude);
        if (!coords) return null;

        const isWorking = item.is_24_time === true;
        const workHoursText = isWorking ? 'Круглосуточно' : 'Пн-Пт: 08:00-17:00, Сб: 08:00-12:00'; // Задаем реальный график
        const statusClass = isWorking ? 'status--open' : 'status--closed'; // Здесь нужна логика проверки текущего времени
        const entityItems: TerminalItem[] = [];
        const entityServices: Services[] = [];
        return {
          id: item.id,
          geometry: { type: 'Point', coordinates: coords },
          properties: {
            type: type,
            title: item.name,
            address: item.address,
            workHours: workHoursText,
            statusClass: statusClass,
            iconSrc: iconPaths[type],
            items: entityItems,
            services: entityServices, 
          },
        };
      })
      .filter(Boolean) as IMapPoint[];
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


  toggleFaq(index: number): void {
    this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
  }

  onCheckboxChange(variableName: keyof MapComponent, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (variableName in this) {
      switch (variableName) {
        case 'allSelected':
          this.allSelected = inputElement.checked;
          break;
        case 'terminalsSelected':
          this.terminalsSelected = inputElement.checked;
          break;
        case 'officesSelected':
          this.officesSelected = inputElement.checked;
          break;
        case 'atmsSelected':
          this.atmsSelected = inputElement.checked;
          break;
        case 'is24Selected':
          this.is24Selected = inputElement.checked;
          break;
        case 'workingNowSelected':
          this.workingNowSelected = inputElement.checked;
          break;
        case 'nfcSelected':
          this.nfcSelected = inputElement.checked;
          break;
        case 'qrCodeSelected':
          this.qrCodeSelected = inputElement.checked;
          break;
        default:
          console.warn(`Неизвестное свойство для изменения: ${variableName}`);
          return;
      }

      if (variableName === 'allSelected' && inputElement.checked) {
        this.officesSelected = false;
        this.atmsSelected = false;
        this.terminalsSelected = false;
      } else if (
        (['officesSelected', 'atmsSelected', 'terminalsSelected'] as (keyof MapComponent)[]).includes(variableName) &&
        inputElement.checked
      ) {
        this.allSelected = false;
      }
    }
    this.sendFilteredData();
  }

  onRegionChange(option: regionList | 0): void {
    if (option === 0) {
      this.regionSelected = 0;
      this.translateService.get('mapPage.filters.regionPlaceholder').subscribe((translation) => {
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
