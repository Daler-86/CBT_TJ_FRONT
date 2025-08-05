import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchantService } from '../../api/merchant.service';
import { RegionService } from '../../api/region.service'; // Используем существующий сервис
import { Merchant, MerchantCategory } from '../../models/merchant.model';
import { regionList } from '../../models/region.model'; // Используем существующую модель
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleApplicationFormComponent } from "../simple-application-form/simple-application-form.component";
@Component({
  selector: 'app-merchant',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, SimpleApplicationFormComponent],
  templateUrl: './merchant.component.html',
  styleUrl: './merchant.component.scss'
})
export class MerchantComponent {
  public readonly merchantApiUrl = '/order/merchant/save'
  imageUrl: string = environment.IMAGE_URL;
  merchants: Merchant[] = [];
  categories: MerchantCategory[] = [];
  regions: regionList[] = [];

  // Состояние фильтров. `null` означает "не применять фильтр".
  filterName: string = '';
  filterRegionId: number | null = null;
  filterCategoryId: number | null = null;
  filterHasCashback: boolean = false; // По умолчанию кэшбек выключен

  // Пагинация
  totalItems = 0;
  itemsPerPage = 12;
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];

  constructor(
    private merchantService: MerchantService,
    private regionService: RegionService
  ) {}

  ngOnInit(): void {
    this.loadFilters();
    this.loadMerchants(); // Загружаем начальный список без фильтров
  }

  // Загрузка данных для выпадающих списков
  loadFilters(): void {
    this.merchantService.getCategories().subscribe(res => {
      this.categories = res.data.merchant_categories;
    });

    this.regionService.getRegionList().subscribe(res => {
      this.regions = res.data.regions;
    });
  }

  // Основная функция загрузки списка мерчантов
  // В файле merchant-list.component.ts

loadMerchants(): void {

  this.merchantService.getMerchants(
    this.itemsPerPage,
    this.currentPage,
    this.filterRegionId,
    this.filterCategoryId,
    this.filterHasCashback,
    this.filterName
  ).subscribe({
    // Блок для успешного ответа
    next: (res) => {
      // console.log('Успешно получил данные:', res); // <-- 2. Проверяем, что пришел ответ

      this.merchants = res.data.merchants;
      
      this.totalItems = res.data.total_count;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePages();
    },
    // Блок для обработки ошибок
    error: (err) => {
      
      console.error('Произошла ошибка в запросе getMerchants!', err); // <-- 3. ЛОВИМ ОШИБКУ ЗДЕСЬ

    }
  });
}

  // Вызывается при изменении любого фильтра
  onFilterChange(): void {
    this.currentPage = 1; // Сбрасываем на первую страницу
    this.loadMerchants();
  }
  
  // --- ЛОГИКА ПАГИНАЦИИ (без изменений) ---
  updatePages(): void {
    this.pages = [];
    if (this.totalPages <= 7) {
      for (let i = 1; i <= this.totalPages; i++) this.pages.push(i);
      return;
    }
    this.pages.push(1);
    if (this.currentPage > 4) this.pages.push(-1);
    const start = Math.max(2, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    for (let i = start; i <= end; i++) this.pages.push(i);
    if (this.currentPage < this.totalPages - 3) this.pages.push(-1);
    this.pages.push(this.totalPages);
  }

  selectPage(page: number): void {
    if (page === -1 || page === this.currentPage) return;
    this.currentPage = page;
    this.loadMerchants();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.selectPage(this.currentPage + 1);
  }

  prevPage(): void {
    if (this.currentPage > 1) this.selectPage(this.currentPage - 1);
  }
}
