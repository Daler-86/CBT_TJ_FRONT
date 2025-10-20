// src/app/services/credit-name.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';

// 1. Указываем правильный путь к вашему сервису
import { CreditService } from '../../api/credit.service';

export const creditNameResolver: ResolveFn<string> = (route) => {
  // 2. Внедряем ваш CreditService
  const creditsService = inject(CreditService);

  // Получаем 'id' из URL (этот код остается без изменений)
  const creditId = route.paramMap.get('id');

  if (!creditId) {
    return 'Кредит'; // Запасное название
  }

  // 3. Вызываем правильный метод из вашего сервиса
  return creditsService.getCreditData(+creditId).pipe(
    // 4. Указываем правильный путь к названию в ответе API
    //    Я предполагаю, что путь такой: response.data.credit.title
    //    !!! ЕСЛИ ПУТЬ ДРУГОЙ, ЗАМЕНИТЕ ЕГО ЗДЕСЬ !!!
    map((response) => response.data.credit_data.title || 'Кредит'),
  );
};
