import { Component, OnInit } from '@angular/core';
import { Vacancy, VacancyService, Category, City } from '../../services/vacancy.service';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VacanciesService } from '../../api/vacancies.service';
import { vacancyCategory, vacancyList } from '../../models/vacancies.model';
import { RegionService } from '../../api/region.service';
import { regionList } from '../../models/region.model';

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  imports: [NgForOf, RouterLink, FormsModule],
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.scss']
})
export class VacancyListComponent{
  vacancyCategory: vacancyCategory[] = [];
  regionList: regionList[] = [];
  vacancyList: vacancyList[] = [];
  selectedCategory: string = '';
  selectedRegion: string = '';
  constructor(private vacanciesService: VacanciesService, private regionService:RegionService) {}

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

    this.vacanciesService.getVacancyList().subscribe(
      (response) => {
        this.vacancyList = response.data.vacancies;
       
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );

  }

  onCategoryChange() {
    if (this.selectedCategory) {
      this.vacanciesService.getVacancyByCategory(+this.selectedCategory).subscribe(
        (data) => {
          this.vacancyList = data.data.vacancies;
        },
        error => {
          console.error('Error loading vacancies by category', error);
        }
      );
    }
  }

  onRegionChange() {
    if (this.selectedRegion) {
      this.vacanciesService.getVacancyByRegion(+this.selectedRegion).subscribe(
        (data) => {
          this.vacancyList = data.data.vacancies;
        },
        error => {
          console.error('Error loading vacancies by category', error);
        }
      );
    }
  }
}
