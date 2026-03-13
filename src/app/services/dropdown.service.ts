import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DropdownService {

  private openDropdownIndex = new BehaviorSubject<number>(-1);
  currentOpenDropdown$ = this.openDropdownIndex.asObservable();

  setOpenDropdown(index: number) {
    this.openDropdownIndex.next(index);
  }

  closeAllDropdowns() {
    this.openDropdownIndex.next(-1);
  }
}
