import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { RkoService } from '../../api/rko.service'; // !!! ВАШ СЕРВИС

export const rkoNameResolver: ResolveFn<string> = (route, state) => {
  const rkoService = inject(RkoService);
  const id = route.paramMap.get('id');
  if (!id) return 'Услуга РКО';
  return rkoService.getRkoDetails(+id).pipe( // !!! ВАШ МЕТОД
    map(response => response.data.title || 'Услуга РКО') // !!! ВАШ ПУТЬ
  );
};