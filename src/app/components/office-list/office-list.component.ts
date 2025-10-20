import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Subscription } from 'rxjs'; // Важно для отписки
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RegionService } from '../../api/region.service';
import { regionList } from '../../models/region.model';

import { Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
export interface regionList1 {
  id: number;
  name_ru: string;
  name_en: string;
  name_tj: string;
  // Можно оставить и общее `name`, если оно где-то используется, сделав его опциональным
  name?: string;
}
@Component({
  selector: 'app-office-list',
  standalone: true,
  imports: [RouterModule, TranslateModule, NgIf, NgFor, CommonModule],
  templateUrl: './office-list.component.html',
  styleUrl: './office-list.component.scss',
})
export class OfficeListComponent implements OnInit, OnDestroy {
  // --- Входы/Выходы для пагинации ---
  @Input() totalPages = 0;
  @Input() currentPage = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  // --- Состояние фильтров ---
  public selectedObjectType: 'offices' | 'terminals' | 'atms' = 'offices';
  public regionSelected = 0; // 0 - для "Все регионы"

  // --- Состояние UI ---
  public dropdownOpen = false;
  public dropdownOpen2 = false;

  // --- Данные ---
  public regionList: regionList[] = [];
  public combinedData: any[] = [];

  // --- Свойства для отображения ---
  public selectedObjectTypeName = '';

  // --- Служебные свойства ---
  private langChangeSubscription!: Subscription;
  private filterService = inject(RegionService);
  public translateService = inject(TranslateService);

  // --- GETTERS для динамического отображения ---

  /**
   * ✅ ВОТ СВОЙСТВО, КОТОРОЕ ИЩЕТ ВАШ HTML.
   * Возвращает переведенное имя выбранного региона.
   */
  public get selectedRegionDisplayName(): string {
    if (this.regionSelected === 0) {
      return this.translateService.instant('mapPage.filters.allRegions');
    }
    const region = this.regionList.find((r) => r.id === this.regionSelected);
    // Проверяем, есть ли регион, чтобы избежать ошибок
    return region ? region.name : this.translateService.instant('mapPage.filters.allRegions');
  }

  // --- ЖИЗНЕННЫЙ ЦИКЛ КОМПОНЕНТА ---

  ngOnInit(): void {
    document.addEventListener('click', this.closeDropdownsManual.bind(this));

    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.loadRegionList(); // Перезагружаем регионы при смене языка
      this.updateSelectedObjectTypeName();
    });

    this.loadRegionList();
    this.updateSelectedObjectTypeName();
    this.sendFilteredData();
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.closeDropdownsManual.bind(this));
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  // --- МЕТОДЫ ЗАГРУЗКИ И ОБРАБОТКИ ДАННЫХ ---

  private loadRegionList(): void {
    this.filterService.getRegionList().subscribe({
      next: (response) => {
        this.regionList = response.data.regions;
      },
      error: (err) => console.error('Ошибка при загрузке регионов', err),
    });
  }

  // public sendFilteredData(isInitialLoad: boolean = false): void {
  //   if (!isInitialLoad) {
  //       this.currentPage = 1;
  //   }

  //   this.filterService.getFilteredByRegion(
  //     this.selectedObjectType === 'atms',
  //     this.selectedObjectType === 'offices',
  //     this.selectedObjectType === 'terminals',
  //     this.regionSelected,
  //     3,
  //     this.currentPage
  //   ).subscribe({
  //     next: (response) => {
  //       this.combinedData = response.data.list_data;
  //       this.totalPages = Math.ceil(response.data.total_count / 3);
  //       this.updatePages();
  //     },
  //     error: (err) => {
  //       console.error('Error fetching filtered data:', err);
  //       this.combinedData = [];
  //       this.totalPages = 0;
  //       this.updatePages();
  //     }
  //   });
  // }
  public sendFilteredData(): void {
    this.filterService
      .getFilteredByRegion(
        this.selectedObjectType === 'atms',
        this.selectedObjectType === 'offices',
        this.selectedObjectType === 'terminals',
        this.regionSelected,
        7,
        this.currentPage,
      )
      .subscribe({
        next: (response) => {
          this.combinedData = response.data.list_data;
          this.totalPages = Math.ceil(response.data.total_count / 7);
          this.updatePages();
        },
        error: (err) => console.error('Error fetching filtered data:', err),
      });
  }
  // --- ОБРАБОТЧИКИ СОБЫТИЙ UI ---

  // public onObjectTypeChange(type: 'offices' | 'terminals' | 'atms'): void {
  //   this.selectedObjectType = type;
  //   this.updateSelectedObjectTypeName();
  //   this.sendFilteredData();
  //   this.dropdownOpen = false;
  // }
  public onObjectTypeChange(type: 'offices' | 'terminals' | 'atms'): void {
    this.selectedObjectType = type;
    this.updateSelectedObjectTypeName();
    this.currentPage = 1; // Сброс на первую страницу
    this.sendFilteredData();
    this.dropdownOpen = false;
  }
  // public onRegionChange(region: regionList | 0): void {
  //   this.regionSelected = (region === 0) ? 0 : region.id;
  //   this.sendFilteredData();
  //   this.dropdownOpen2 = false;
  // }
  public onRegionChange(region: regionList | 0): void {
    this.regionSelected = region === 0 ? 0 : region.id;
    this.currentPage = 1; // Сброс на первую страницу
    this.sendFilteredData();
    this.dropdownOpen2 = false;
  }
  private updateSelectedObjectTypeName(): void {
    const key = `mapPage.filters.${this.selectedObjectType}`;
    this.selectedObjectTypeName = this.translateService.instant(key);
  }
  // --- ПАГИНАЦИЯ (полный код) ---
  public pages: number[] = [];

  private updatePages(): void {
    this.pages = [];
    if (this.totalPages <= 1) return;

    const visiblePages = 3;
    let startPage = Math.max(1, this.currentPage - 1);
    let endPage = Math.min(this.totalPages, this.currentPage + 1);

    if (this.currentPage === 1) endPage = Math.min(this.totalPages, visiblePages);
    if (this.currentPage === this.totalPages) startPage = Math.max(1, this.totalPages - visiblePages + 1);

    if (startPage > 1) {
      this.pages.push(1);
      if (startPage > 2) this.pages.push(-1);
    }
    for (let i = startPage; i <= endPage; i++) this.pages.push(i);
    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) this.pages.push(-1);
      this.pages.push(this.totalPages);
    }
  }
  public selectPage(page: number): void {
    if (page === -1 || page === this.currentPage) return;
    this.currentPage = page;
    this.pageChange.emit(this.currentPage);
    this.sendFilteredData(); // Запрашиваем данные для НОВОЙ страницы
    this.scrollToTop();
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) this.selectPage(this.currentPage + 1);
  }

  public prevPage(): void {
    if (this.currentPage > 1) this.selectPage(this.currentPage - 1);
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- УПРАВЛЕНИЕ ВЫПАДАЮЩИМИ СПИСКАМИ (полный код) ---
  @HostListener('document:click', ['$event'])
  closeDropdownsManual(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.dropdownOpen = false;
      this.dropdownOpen2 = false;
    }
  }

  public toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    this.dropdownOpen2 = false;
  }

  public toggleDropdown2(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen2 = !this.dropdownOpen2;
    this.dropdownOpen = false;
  }
}
