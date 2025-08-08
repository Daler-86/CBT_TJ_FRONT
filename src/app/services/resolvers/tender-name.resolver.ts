import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { TenderService } from '../../api/tender.service'; // !!! ВАШ СЕРВИС

export const tenderNameResolver: ResolveFn<string> = (route, state) => {
  const tenderService = inject(TenderService);
  const id = route.paramMap.get('id');
  if (!id) return 'Тендер';
  return tenderService.getTenderDetailData(+id).pipe( // !!! ВАШ МЕТОД
    map(response => response.data.tender.name || 'Тендер') // !!! ВАШ ПУТЬ
  );
};