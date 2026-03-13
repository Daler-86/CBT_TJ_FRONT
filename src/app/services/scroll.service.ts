import { Injectable, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scroller = inject(ViewportScroller);

  public scrollToAnchor(anchor: string): void {
  
    setTimeout(() => {
      this.scroller.scrollToAnchor(anchor);
    }, 100); 
  }
}
