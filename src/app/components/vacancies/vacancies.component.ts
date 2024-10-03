import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { VacanciesService } from '../../api/vacancies.service';
import { vacancyContent, vacancyGallery, vacancyItem, vacancyStatistic } from '../../models/vacancies.model';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-vacancies',
  standalone: true,
  imports: [RouterLink, RouterModule, RouterOutlet,NgFor],
  templateUrl: './vacancies.component.html',
  styleUrl: './vacancies.component.scss'
})
export class VacanciesComponent {
  currentIndex: number = 0;
  vacancyContent:vacancyContent[]=[]
  vacancyItems:vacancyItem[]=[]
  vacancyStatistics:vacancyStatistic[]=[]
  vacancyGalleries:vacancyGallery[]=[]

constructor(private vacanciesService:VacanciesService){}
ngOnInit():void{

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
  // Пример данных офисов
  offices = [
    { 
      imageUrl: '../../../assets/icons/ofis.png', 
      title: 'Центры обслуживания', 
      description: 'Предоставляем качественную поддержку и помощь в удобном для вас формате' 
    },
    { 
      imageUrl: '../../../assets/icons/ofis.png', 
      title: 'Головной офис', 
      description: 'Офис в центре города с удобным доступом и современной инфраструктурой' 
    },
    { 
      imageUrl: '../../../assets/icons/ofis.png', 
      title: 'Региональные офисы', 
      description: 'Представительства в основных городах с комфортными условиями' 
    },
    // Добавьте дополнительные офисы по мере необходимости
  ];

  next() {
    if (this.currentIndex < this.offices.length - 1) {
      this.currentIndex++;
    }
}
prev() {
  if (this.currentIndex > 0) {
    this.currentIndex--;
  }
}

}
