import { Directive, HostListener, Input, inject } from '@angular/core';
import { ScrollService } from '../services/scroll.service';

@Directive({
  selector: '[scrollTo]', 
  standalone: true,
})
export class ScrollToDirective {
  @Input('scrollTo') anchor = '';

  private scrollService = inject(ScrollService);
  @HostListener('click')
  onClick(): void {
    if (this.anchor) {
      this.scrollService.scrollToAnchor(this.anchor);
    }
  }
}
