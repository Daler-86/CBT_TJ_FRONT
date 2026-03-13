
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';

import { CardsService } from '../../api/cards.service';

export const cardNameResolver: ResolveFn<string> = (route) => {
  const cardsService = inject(CardsService);
  const id = route.paramMap.get('id');

  if (!id) {
    return 'Карта'; 
  }

  return cardsService.getCardData(+id).pipe(
    map((response) => response.data.card_data.title || 'Карта'),
  );
};
