import { Component } from '@angular/core';

@Component({
  selector: 'app-vacancies',
  standalone: true,
  imports: [],
  templateUrl: './vacancies.component.html',
  styleUrl: './vacancies.component.scss'
})
export class VacanciesComponent {
  currentIndex: number = 0;

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
