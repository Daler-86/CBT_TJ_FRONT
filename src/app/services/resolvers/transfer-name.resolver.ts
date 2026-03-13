
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { TransfersService } from '../../api/transfer.service';


export const transferNameResolver: ResolveFn<string> = (route) => {
  const transferService = inject(TransfersService);
  const id = route.paramMap.get('id');

  if (!id) {
    return 'Перевод'; 
  }

  return transferService.getTransferData(+id).pipe(
    map((response) => response.data.transfer_data.title || 'Перевод'),
  );
};
