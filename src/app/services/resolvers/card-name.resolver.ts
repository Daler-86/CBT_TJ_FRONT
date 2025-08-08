// src/app/services/resolvers/card-name.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';

// !!! ЗАМЕНИТЕ НА ВАШ СЕРВИС ДЛЯ КАРТ !!!
import { CardsService } from '../../api/cards.service'; 

export const cardNameResolver: ResolveFn<string> = (route, state) => {
  // Внедряем ваш сервис
  const cardsService = inject(CardsService);
  const id = route.paramMap.get('id');

  if (!id) {
    return 'Карта'; // Запасное название
  }

  // !!! ЗАМЕНИТЕ НА ВАШ МЕТОД ПОЛУЧЕНИЯ ДАННЫХ !!!
  return cardsService.getCardData(+id).pipe(
    // !!! ЗАМЕНИТЕ НА ПРАВИЛЬНЫЙ ПУТЬ К НАЗВАНИЮ В ОТВЕТЕ API !!!
    map(response => response.data.card_data.title || 'Карта')
  );
};