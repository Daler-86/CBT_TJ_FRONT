
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';

import { CreditService } from '../../api/credit.service';

export const creditNameResolver: ResolveFn<string> = (route) => {
  const creditsService = inject(CreditService);
  const creditId = route.paramMap.get('id');

  if (!creditId) {
    return 'Кредит';
  }

  return creditsService.getCreditData(+creditId).pipe(
    map((response) => response.data.credit_data.title || 'Кредит'),
  );
};
