import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component,ElementRef,HostListener, ViewChild, } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RegionService } from '../../api/region.service';
import { Atm, FilteredData, Office, Terminal, officeList, regionList } from '../../models/region.model';
import { cardFaqs } from '../../models/cards.model';
import { CardsService } from '../../api/cards.service';
import {  Input, Output, EventEmitter, OnInit } from '@angular/core';
@Component({
  selector: 'app-office-list',
  standalone: true,
  imports: [GoogleMapsModule,RouterLink, RouterModule, TranslateModule, NgIf, NgFor,CommonModule,],
  templateUrl: './office-list.component.html',
  styleUrl: './office-list.component.scss'
})
export class OfficeListComponent {
  constructor(
    private filterService: RegionService,
    private translateService: TranslateService,
    private cardsService: CardsService
  ) {}


  @Input() totalPages: number = 0; // Общее количество страниц
  @Input() currentPage: number = 1; // Текущая страница
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();


  // offices: any[] = [];
 

 
  terminalsSelected: boolean = false;
  officesSelected: boolean = false;
  atmsSelected: boolean = false;
  

  dropdownOpen: boolean = false;
  dropdownOpen2: boolean = false;

  regionSelected:any=0
  regionList: any[] = [];

 
data:any[]=[]
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
    // event.stopPropagation();
  }

  toggleDropdown2(event: Event): void {
    this.dropdownOpen2 = !this.dropdownOpen2;
    // event.stopPropagation();
  }

  showInfo(markerInfo: string) {
    alert(markerInfo);
  }
  regionSelectedName='Город'
  ngOnInit(): void {
    document.addEventListener('click', this.closeDropdownsManual.bind(this));


    this.filterService.getRegionList().subscribe(
      (response) => {
        this.regionList = response.data.regions;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  this.officesSelected=true
this.sendFilteredData();  
this.updatePages();
   
  }



 



  ngOnDestroy(): void {
    document.removeEventListener('click', this.closeDropdownsManual.bind(this));
    this.sendFilteredData()
  }
  combinedData: any[] = [];
  sendFilteredData(): void {
    this.filterService.getFilteredByRegion(this.atmsSelected, this.officesSelected, this.terminalsSelected,this.regionSelected,8,this.currentPage).subscribe({
      next: (response) => {
      console.log('Filtered data received:', response); 
      this.combinedData=response.data.list_data
      this.totalPages=Math.ceil(response.data.total_count/8)
      this.updatePages();
      },
      error: (err) => {
        console.error('Error fetching filtered data:', err);
      }
    });
  }
  inputvalue="Фильтр"

  onCheckboxChange(variableName: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    // Установить только одну переменную в true, остальные в false
    this.terminalsSelected = false;
    this.officesSelected = false;
    this.atmsSelected = false;

    if (inputElement && variableName in this) {
      (this as any)[variableName] = inputElement.checked;
      this.inputvalue=variableName=='officesSelected'?"Офисы":variableName=='terminalsSelected'?"Терминалы":"Банкоматы"
    }

    this.sendFilteredData();
    this.dropdownOpen=false
  }

  onRegionChange(obj: any) {
    if (obj && obj.id) {
      // Если выбран конкретный регион
      this.regionSelected = obj.id;
      this.regionSelectedName = obj.name;
    } else {
      // Если выбран "Все"
      this.regionSelected = '';
      this.regionSelectedName = "Все";
    }
  
    // Отправляем данные фильтрации
    this.sendFilteredData();
  
    // Закрываем выпадающий список
    this.dropdownOpen2 = false;
  }
  pages: number[] = []; // Массив для отображения номеров страниц


  ngOnChanges() {
    this.updatePages();
  }

  updatePages() {
    this.pages = [];
    const visiblePages = 3; // Количество видимых страниц до/после текущей
    const rangeStart = Math.max(1, this.currentPage - 1);
    const rangeEnd = Math.min(this.totalPages, this.currentPage + visiblePages - 1);

    // Добавляем страницы перед ...
    if (rangeStart > 2) {
      this.pages.push(1);
      if (rangeStart > 3) {
        this.pages.push(-1); // Индикатор для ...
      }
    }

    // Добавляем текущие видимые страницы
    for (let i = rangeStart; i <= rangeEnd; i++) {
      this.pages.push(i);
    }

    // Добавляем страницы после ...
    if (rangeEnd < this.totalPages - 1) {
      if (rangeEnd < this.totalPages - 2) {
        this.pages.push(-1); // Индикатор для ...
      }
      this.pages.push(this.totalPages);
    }

  }
  scrollToTop(): void {
    const listElement = document.querySelector('.list-container'); // Замените '.list-container' на ваш селектор списка
    if (listElement) {
      listElement.scrollTo({
        top: 0,
        behavior: 'smooth' // Плавная прокрутка
      });
    } else {
      // Если контейнер не найден, прокручиваем всю страницу
      window.scrollTo({
        top: 1,
        behavior: 'smooth' // Плавная прокрутка
      });
    }
  }
  selectPage(page: number) {
    if (page === -1) return; // Игнорируем "..."
    this.currentPage = page;
    this.updatePages();
    this.pageChange.emit(this.currentPage);
    this.scrollToTop(); 
    this.sendFilteredData()
  }

  nextPage() { 
    if (this.currentPage < this.totalPages) {
      this.selectPage(this.currentPage + 1);
      this.scrollToTop();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.selectPage(this.currentPage - 1);
      this.scrollToTop();
    }
  }
}
