import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { VacanciesService } from '../../api/vacancies.service';

export const vacancyNameResolver: ResolveFn<string> = (route) => {
  const vacancyService = inject(VacanciesService);
  const id = route.paramMap.get('id');

  if (!id) {
    return 'Вакансия'; 
  }

  return vacancyService.getVacancyData(+id).pipe(
    map((response) => response.data.vacancy_data.name || 'Вакансия'),
  );
};
