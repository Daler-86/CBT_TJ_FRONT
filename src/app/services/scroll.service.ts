import { Injectable, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scroller = inject(ViewportScroller);

  /**
   * Универсальный метод для плавной прокрутки к любому элементу по его ID.
   * @param anchor ID HTML-элемента (без #).
   */
  public scrollToAnchor(anchor: string): void {
    // Небольшая задержка, чтобы дать Angular время отрисовать все элементы,
    // особенно те, что находятся внутри *ngIf.
    setTimeout(() => {
      // console.log(`Прокрутка к якорю: #${anchor}`);
      this.scroller.scrollToAnchor(anchor);
    }, 100); // 100 миллисекунд обычно достаточно
  }
}
