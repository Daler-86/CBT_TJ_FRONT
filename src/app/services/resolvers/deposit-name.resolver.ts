// src/app/services/resolvers/deposit-name.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { DepositsService } from '../../api/deposit.service';

export const depositNameResolver: ResolveFn<string> = (route, state) => {
  const depositsService = inject(DepositsService);
  const id = route.paramMap.get('id');

  if (!id) {
    return 'Вклад'; // Запасное название
  }

  // !!! ЗАМЕНИТЕ НА ВАШ МЕТОД ПОЛУЧЕНИЯ ДАННЫХ !!!
  return depositsService.getDepositData(+id).pipe(
    // !!! ЗАМЕНИТЕ НА ПРАВИЛЬНЫЙ ПУТЬ К НАЗВАНИЮ В ОТВЕТЕ API !!!
    map(response => response.data.title || 'Вклад') 
  );
};