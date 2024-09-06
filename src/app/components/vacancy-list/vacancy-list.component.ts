import { Component, OnInit } from '@angular/core';
import { Vacancy, VacancyService, Category, City } from '../../services/vacancy.service';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  imports: [NgForOf, RouterLink, FormsModule],
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.scss']
})
export class VacancyListComponent implements OnInit {
  vacancies: Vacancy[] = [];
  filteredVacancies: Vacancy[] = [];
  categories: Category[] = [];
  cities: City[] = [];
  selectedCategory: string = '';
  selectedCity: string = '';

  constructor(private vacancyService: VacancyService) {}

  ngOnInit() {
    this.vacancyService.getVacancies().subscribe(vacancies => {
      this.vacancies = vacancies;
      this.filteredVacancies = vacancies; // Изначально показываем все вакансии
    });

    this.vacancyService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.vacancyService.getCities().subscribe(cities => {
      this.cities = cities;
    });
  }

  // Метод для фильтрации вакансий по категории и городу
  filterVacancies() {
    this.filteredVacancies = this.vacancies.filter(v =>
      (!this.selectedCategory || v.title === this.selectedCategory) &&
      (!this.selectedCity || v.city === this.selectedCity)
    );
  }

  // Метод для обработки клика по кнопке "Подробнее"
  onMoreDetails(vacancy: Vacancy): void {
    this.vacancyService.selectVacancy(vacancy);
  }
}
