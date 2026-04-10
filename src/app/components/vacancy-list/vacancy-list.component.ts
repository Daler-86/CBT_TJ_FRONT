import { Component, Output, OnInit, Input, EventEmitter, OnChanges, inject, HostListener } from '@angular/core';

import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VacanciesService } from '../../api/vacancies.service';
import { vacancyCategory, vacancyList } from '../../models/vacancies.model';
import { RegionService } from '../../api/region.service';
import { regionList } from '../../models/region.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  imports: [ RouterLink, FormsModule, TranslateModule],
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.scss'],
})
export class VacancyListComponent implements OnInit, OnChanges {
  vacancyCategory: vacancyCategory[] = [];
  regionList: regionList[] = [];
  vacancyList: vacancyList[] = [];
  selectedCategory:number=0;
  selectedRegion:number=0;
  private vacanciesService = inject(VacanciesService);
  private regionService = inject(RegionService);

  @Input() totalPages = 0;
  @Input() currentPage = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  pages: number[] = [];
  categoryOpen = false;
  cityOpen = false;
  selectedCategoryName = '';
  selectedCityName = '';
  
  ngOnInit() {
    this.vacanciesService.getVacancyCategory().subscribe(
      (response) => {
        this.vacancyCategory = response.data.vacancy_categories;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );

    this.regionService.getRegionList().subscribe(
      (response) => {
        this.regionList = response.data.regions;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );

    this.loadAllVacancies();
    this.updatePages();
  }
  vacancyCount = 0;
  loadAllVacancies() {
    const pageSize = 10;
    this.vacanciesService
      .getVacancyList(pageSize, this.currentPage, +this.selectedCategory, +this.selectedRegion)
      .subscribe(
        (response) => {
          this.vacancyList = response.data.vacancies;
          this.totalPages = Math.ceil(response.data.total_count / pageSize);
          this.vacancyCount = response.data.total_count;
          this.updatePages();
        },
        (error) => {
          console.error('Ошибка при запросе данных', error);
        },
      );
  }
  ngOnChanges() {
    this.updatePages();
  }

  updatePages() {
    this.pages = [];
    const visiblePages = 3;
    const rangeStart = Math.max(1, this.currentPage - 1);
    const rangeEnd = Math.min(this.totalPages, this.currentPage + visiblePages - 1);

    if (rangeStart > 2) {
      this.pages.push(1);
      if (rangeStart > 3) {
        this.pages.push(-1);
      }
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      this.pages.push(i);
    }

    if (rangeEnd < this.totalPages - 1) {
      if (rangeEnd < this.totalPages - 2) {
        this.pages.push(-1);
      }
      this.pages.push(this.totalPages);
    }
  }
  selectPage(page: number) {
    if (page === -1) return;
    this.currentPage = page;
    this.updatePages();
    this.pageChange.emit(this.currentPage);
    this.scrollToTop();
    this.loadAllVacancies();
  }
  scrollToTop(): void {
    const listElement = document.querySelector('.list-container');
    if (listElement) {
      listElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 1,
        behavior: 'smooth',
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
  toggleCategoryDropdown(event: Event) {
    event.stopPropagation();
    this.categoryOpen = !this.categoryOpen;
    this.cityOpen = false; // закрываем второй, если открыт
  }
  
  toggleCityDropdown(event: Event) {
    event.stopPropagation();
    this.cityOpen = !this.cityOpen;
    this.categoryOpen = false; // закрываем первый, если открыт
  }
  
  selectCategory(id: number, name: string) {
    this.selectedCategory = id;
    this.selectedCategoryName = name;
    this.categoryOpen = false;
    this.loadAllVacancies(); // вызываем твою функцию фильтрации
  }
  
  selectCity(id: number, name: string) {
    this.selectedRegion = id;
    this.selectedCityName = name;
    this.cityOpen = false;
    this.loadAllVacancies(); // вызываем твою функцию фильтрации
  }
  
  // Добавим закрытие при клике мимо (как мы делали в хедере)
  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event) {
    this.categoryOpen = false;
    this.cityOpen = false;
  }
}
