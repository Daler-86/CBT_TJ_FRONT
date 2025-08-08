import { Component,Output, OnInit, Input,EventEmitter, } from '@angular/core';
import { Vacancy, VacancyService, Category, City } from '../../services/vacancy.service';
import { NgForOf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VacanciesService } from '../../api/vacancies.service';
import { vacancyCategory, vacancyList } from '../../models/vacancies.model';
import { RegionService } from '../../api/region.service';
import { regionList } from '../../models/region.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  imports: [NgForOf, RouterLink,  FormsModule,TranslateModule, RouterOutlet],
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.scss']
})

export class VacancyListComponent {
  vacancyCategory: vacancyCategory[] = [];
  regionList: regionList[] = [];
  vacancyList: vacancyList[] = [];
  selectedCategory: string = '';
  selectedRegion: string = '';

  constructor(private vacanciesService: VacanciesService, private regionService: RegionService) {}
  @Input() totalPages: number = 0; // Общее количество страниц
  @Input() currentPage: number = 1; // Текущая страница
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  pages: number[] = [];

  ngOnInit() {
    this.vacanciesService.getVacancyCategory().subscribe(
      (response) => {
        this.vacancyCategory = response.data.vacancy_categories;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );

    this.regionService.getRegionList().subscribe(
      (response) => {
        this.regionList = response.data.regions;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );

    this.loadAllVacancies();
    this.updatePages();
  }
vacancyCount:number=0
  loadAllVacancies() {

    this.vacanciesService.getVacancyList(6,this.currentPage,+this.selectedCategory,+this.selectedRegion).subscribe(
      (response) => {
        this.vacancyList = response.data.vacancies;
     
        this.totalPages=Math.round(response.data.total_count/6)
        this.vacancyCount=response.data.total_count
        this.updatePages(); 
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }
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
  selectPage(page: number) {
    if (page === -1) return; // Игнорируем "..."
    this.currentPage = page;
    this.updatePages();
    this.pageChange.emit(this.currentPage);
    this.scrollToTop(); 
    this.loadAllVacancies()
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

