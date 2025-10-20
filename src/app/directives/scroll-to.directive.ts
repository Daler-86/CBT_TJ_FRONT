import { Directive, HostListener, Input, inject } from '@angular/core';
import { ScrollService } from '../services/scroll.service';

@Directive({
  selector: '[scrollTo]', // Активируется на элементах с атрибутом [scrollTo]
  standalone: true,
})
export class ScrollToDirective {
  // Принимает ID элемента, к которому нужно прокрутить, из HTML
  @Input('scrollTo') anchor = '';

  private scrollService = inject(ScrollService);

  // Слушает событие 'click' на элементе, к которому применена директива
  @HostListener('click')
  onClick(): void {
    // Проверяем, что ID был передан
    if (this.anchor) {
      // Вызываем наш универсальный сервис
      this.scrollService.scrollToAnchor(this.anchor);
    }
  }
}
