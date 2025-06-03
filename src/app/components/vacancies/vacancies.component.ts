import {Component} from '@angular/core';
import {RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import {VacanciesService} from '../../api/vacancies.service';
import {vacancyContent, vacancyGallery, vacancyItem, vacancyStatistic} from '../../models/vacancies.model';
import {NgFor, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-vacancies',
  standalone: true,
  imports: [RouterLink, RouterModule, RouterOutlet, NgFor, TranslateModule],
  templateUrl: './vacancies.component.html',
  styleUrl: './vacancies.component.scss'
})
export class VacanciesComponent {
  imageUrl: string = environment.IMAGE_URL;
  currentIndex: number = 0;
  vacancyContent: vacancyContent[] = []
  vacancyItems: vacancyItem[] = []
  vacancyStatistics: vacancyStatistic[] = []
  vacancyGalleries: vacancyGallery[] = []

  constructor(private vacanciesService: VacanciesService) {
  }

  ngOnInit(): void {

    this.vacanciesService.getVacancyContent().subscribe(
      (response) => {
        this.vacancyContent = response.data.vacancy_contents;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );

    this.vacanciesService.getVacancyContentItem().subscribe(
      (response) => {
        this.vacancyItems = response.data.vacancy_content_items;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );

    this.vacanciesService.getVacancyStatistic().subscribe(
      (response) => {
        this.vacancyStatistics = response.data.vacancy_content_statistics;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );

    this.vacanciesService.getVacancyGallery().subscribe(
      (response) => {
        this.vacancyGalleries = response.data.vacancy_galleries;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );

  }


  next() {
    if (this.currentIndex < this.vacancyGalleries.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

}
