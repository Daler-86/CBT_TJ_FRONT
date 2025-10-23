import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true,
})
export class NumberFormatPipe implements PipeTransform {
  transform(): unknown {
    return null;
  }
}
