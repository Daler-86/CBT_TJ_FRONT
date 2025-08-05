// src/app/pipes/split-by-dash.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitByDash',
  standalone: true
})
export class SplitByDashPipe implements PipeTransform {

  transform(value: string | null | undefined): string[] {
    if (!value) {
      return []; // Если на входе пусто, возвращаем пустой массив
    }

    // "Разрезаем" строку по дефису на массив
    const parts = value.split(' — ');
debugger
    // Убираем пустые элементы и возвращаем готовый массив
    return parts.filter(part => part.trim() !== '');
  }

}
