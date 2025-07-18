// src/app/directives/numeric-input.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumericInput]', 
  standalone: true
})
export class NumericInputDirective {

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Разрешаем: Backspace, Tab, End, Home, стрелки, Delete
    const allowedKeys = [
      'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'
    ];
    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }

    // Блокируем все, что не является цифрой
    if (!/^\d$/.test(event.key)) {
      event.preventDefault(); // Отменяем ввод
    }
  }
}