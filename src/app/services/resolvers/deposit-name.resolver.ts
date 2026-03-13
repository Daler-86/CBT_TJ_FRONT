
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { DepositsService } from '../../api/deposit.service';

export const depositNameResolver: ResolveFn<string> = (route) => {
  const depositsService = inject(DepositsService);
  const id = route.paramMap.get('id');

  if (!id) {
    return 'Вклад';
  }

  return depositsService.getDepositData(+id).pipe(
    map((response) => response.data.title || 'Вклад'),
  );
};
