import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { VacanciesService } from '../../api/vacancies.service';

 

export const vacancyNameResolver: ResolveFn<string> = (route, state) => {
  // Внедряем ваш сервис
  const vacancyService = inject(VacanciesService);
  // Получаем id из URL
  const id = route.paramMap.get('id');

  if (!id) {
    return 'Вакансия'; // Запасное название, если ID не найден
  }

  // !!! ЗАМЕНИТЕ НА ВАШ МЕТОД ПОЛУЧЕНИЯ ВАКАНСИИ ПО ID !!!
  return vacancyService.getVacancyData(+id).pipe(
    // !!! ЗАМЕНИТЕ НА ПРАВИЛЬНЫЙ ПУТЬ К НАЗВАНИЮ В ОТВЕТЕ API !!!
    map(response => response.data.vacancy_data.name || 'Вакансия') 
  );
};