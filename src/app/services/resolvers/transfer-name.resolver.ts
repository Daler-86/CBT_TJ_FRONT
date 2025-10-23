// src/app/services/resolvers/transfer-name.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { TransfersService } from '../../api/transfer.service';

// !!! ЗАМЕНИТЕ НА ВАШ СЕРВИС ДЛЯ ПЕРЕВОДОВ !!!

export const transferNameResolver: ResolveFn<string> = (route) => {
  const transferService = inject(TransfersService);
  const id = route.paramMap.get('id');

  if (!id) {
    return 'Перевод'; // Запасное название
  }

  // !!! ЗАМЕНИТЕ НА ВАШ МЕТОД ПОЛУЧЕНИЯ ДАННЫХ !!!
  return transferService.getTransferData(+id).pipe(
    // !!! ЗАМЕНИТЕ НА ПРАВИЛЬНЫЙ ПУТЬ К НАЗВАНИЮ В ОТВЕТЕ API !!!
    // Предполагаю, что структура transfer.title[1].value для русского языка,
    // но лучше, если сервис вернет одно название.
    map((response) => response.data.transfer_data.title || 'Перевод'),
  );
};
