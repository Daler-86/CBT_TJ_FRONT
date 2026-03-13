
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitByDash',
  standalone: true,
})
export class SplitByDashPipe implements PipeTransform {
  transform(value: string | null | undefined): string[] {
    if (!value) {
      return []; 
    }

    const parts = value.split('-');
    return parts.filter((part) => part.trim() !== '');
  }
}
